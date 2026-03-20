import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
		throw redirect(302, '/auth/login');
	}

	const currentYear = config.currentYear;

	const accepted = await prisma.call_submissions.findMany({
		where: { call_year: currentYear, accepted: true, waitlisted: false },
		orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
		select: {
			id: true, first_name: true, last_name: true, email: true, university: true,
			department: true, country: true, nationality: true, gender: true, age: true,
			status: true, domain: true, diploma: true,
			phd_ad_name: true, phd_year: true, phd_ad_mail: true,
			title: true, summary: true, paper: true,
			cancelled: true,
		},
	});

	const emails = accepted.map((s) => s.email);

	const [validations, studentRecords, userRecords, allCountries] = await Promise.all([
		prisma.students_validations.findMany({
			where: { student_email: { in: emails }, call_year: currentYear },
			select: { student_email: true, section: true, validated_at: true },
		}),
		prisma.students.findMany({
			where: { email: { in: emails } },
			select: { email: true, photo: true },
		}),
		prisma.users.findMany({
			where: { email: { in: emails } },
			select: { id: true, email: true },
		}),
		prisma.countries.findMany({ select: { id: true, name: true } }),
	]);

	const countryMap = new Map<number, string>();
	for (const c of allCountries) {
		countryMap.set(c.id, c.name);
	}

	// Map email → userId for travel lookup
	const emailToUserId = new Map<string, string>();
	for (const u of userRecords) {
		emailToUserId.set(u.email, String(u.id));
	}

	const userIds = userRecords.map((u) => String(u.id));
	const travels = await prisma.students_travels.findMany({
		where: { student_id: { in: userIds } },
	});
	const travelMap = new Map<string, typeof travels[number]>();
	for (const t of travels) {
		travelMap.set(t.student_id, t);
	}

	// Build lookup maps
	const validationMap = new Map<string, Set<string>>();
	for (const v of validations) {
		if (!validationMap.has(v.student_email)) {
			validationMap.set(v.student_email, new Set());
		}
		validationMap.get(v.student_email)!.add(v.section);
	}

	const photoMap = new Map<string, boolean>();
	for (const s of studentRecords) {
		photoMap.set(s.email, !!(s.photo && s.photo.length > 0));
	}

	function fmt(dt: Date | null | undefined): string {
		if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
		return dt.toISOString().slice(0, 10);
	}

	function fmtTime(dt: Date | null | undefined): string {
		if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
		return dt.toISOString().slice(11, 16);
	}

	const students = accepted.map((s) => {
		const sections = validationMap.get(s.email) ?? new Set();
		const profileValidated = sections.has('profile');
		const paperValidated = sections.has('paper');
		const travelValidated = sections.has('travel');
		const userId = emailToUserId.get(s.email);
		const travel = userId ? travelMap.get(userId) : undefined;
		return {
			id: Number(s.id),
			firstName: s.first_name,
			lastName: s.last_name,
			email: s.email,
			university: s.university ?? '',
			department: s.department ?? '',
			country: countryMap.get(s.country) ?? String(s.country),
			nationality: s.nationality ? (countryMap.get(s.nationality) ?? String(s.nationality)) : '',
			gender: s.gender ?? '',
			age: s.age,
			status: config.statusOptions[s.status] ?? String(s.status),
			domain: s.domain ?? '',
			diploma: s.diploma ?? '',
			phdAdvisorName: s.phd_ad_name ?? '',
			phdAdvisorEmail: s.phd_ad_mail ?? '',
			phdYear: s.phd_year ?? null,
			paperTitle: s.title ?? '',
			paperSummary: s.summary ?? '',
			hasPaperFile: !!(s.paper && s.paper.length > 0),
			hasPhoto: photoMap.get(s.email) ?? false,
			cancelled: s.cancelled,
			profileValidated,
			paperValidated,
			travelValidated,
			allValidated: profileValidated && paperValidated && travelValidated,
			travel: travel ? {
				arrivalDate: fmt(travel.arrival_date_time),
				arrivalTime: fmtTime(travel.arrival_date_time),
				arrivalTransport: travel.arrival_transport,
				arrivalLocation: config.travel.locations[travel.arrival_location as unknown as number] ?? travel.arrival_location,
				arrivalFlight: travel.arrival_flight,
				arrivalTransfer: config.transfer.arrival[travel.arrival_transfer] ?? String(travel.arrival_transfer),
				departureDate: fmt(travel.departure_date_time),
				departureTime: fmtTime(travel.departure_date_time),
				departureTransport: travel.departure_transport,
				departureLocation: config.travel.locations[travel.departure_location as unknown as number] ?? travel.departure_location,
				departureFlight: travel.departure_flight,
				departureTransfer: config.transfer.departure[travel.departure_transfer] ?? String(travel.departure_transfer),
			} : null,
		};
	});

	const active = students.filter((s) => !s.cancelled);
	const total = students.length;
	const cancelledCount = students.filter((s) => s.cancelled).length;
	const allValidated = active.filter((s) => s.allValidated).length;
	const profileCount = active.filter((s) => s.profileValidated).length;
	const paperCount = active.filter((s) => s.paperValidated).length;
	const travelCount = active.filter((s) => s.travelValidated).length;

	return {
		year: currentYear,
		students,
		stats: { total, cancelledCount, activeTotal: total - cancelledCount, allValidated, profileCount, paperCount, travelCount },
	};
};

export const actions: Actions = {
	cancel: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Unauthorized' });
		}
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Missing id' });
		await prisma.call_submissions.update({ where: { id: BigInt(id) }, data: { cancelled: true } });
		return { success: true };
	},

	uncancel: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin'])) {
			return fail(403, { error: 'Unauthorized' });
		}
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Missing id' });
		await prisma.call_submissions.update({ where: { id: BigInt(id) }, data: { cancelled: false } });
		return { success: true };
	},
};
