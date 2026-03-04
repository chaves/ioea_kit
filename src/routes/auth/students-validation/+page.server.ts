import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
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
		},
	});

	const emails = accepted.map((s) => s.email);

	const [validations, studentRecords, userRecords] = await Promise.all([
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
	]);

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
			country: s.country,
			nationality: s.nationality,
			gender: s.gender ?? '',
			age: s.age,
			status: s.status,
			domain: s.domain ?? '',
			diploma: s.diploma ?? '',
			phdAdvisorName: s.phd_ad_name ?? '',
			phdAdvisorEmail: s.phd_ad_mail ?? '',
			phdYear: s.phd_year ?? null,
			paperTitle: s.title ?? '',
			paperSummary: s.summary ?? '',
			hasPaperFile: !!(s.paper && s.paper.length > 0),
			hasPhoto: photoMap.get(s.email) ?? false,
			profileValidated,
			paperValidated,
			travelValidated,
			allValidated: profileValidated && paperValidated && travelValidated,
			travel: travel ? {
				arrivalDate: fmt(travel.arrival_date_time),
				arrivalTransport: travel.arrival_transport,
				arrivalLocation: travel.arrival_location,
				arrivalFlight: travel.arrival_flight,
				arrivalTransfer: travel.arrival_transfer,
				departureDate: fmt(travel.departure_date_time),
				departureTransport: travel.departure_transport,
				departureLocation: travel.departure_location,
				departureFlight: travel.departure_flight,
				departureTransfer: travel.departure_transfer,
			} : null,
		};
	});

	const total = students.length;
	const allValidated = students.filter((s) => s.allValidated).length;
	const profileCount = students.filter((s) => s.profileValidated).length;
	const paperCount = students.filter((s) => s.paperValidated).length;
	const travelCount = students.filter((s) => s.travelValidated).length;

	return {
		year: currentYear,
		students,
		stats: { total, allValidated, profileCount, paperCount, travelCount },
	};
};
