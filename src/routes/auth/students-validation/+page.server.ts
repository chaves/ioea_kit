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
		select: { id: true, first_name: true, last_name: true, email: true, university: true },
	});

	const emails = accepted.map((s) => s.email);

	const [validations, studentRecords] = await Promise.all([
		prisma.students_validations.findMany({
			where: { student_email: { in: emails }, call_year: currentYear },
			select: { student_email: true, section: true, validated_at: true },
		}),
		prisma.students.findMany({
			where: { email: { in: emails } },
			select: { email: true, photo: true },
		}),
	]);

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

	const students = accepted.map((s) => {
		const sections = validationMap.get(s.email) ?? new Set();
		const profileValidated = sections.has('profile');
		const paperValidated = sections.has('paper');
		const travelValidated = sections.has('travel');
		return {
			id: Number(s.id),
			firstName: s.first_name,
			lastName: s.last_name,
			email: s.email,
			university: s.university ?? '',
			hasPhoto: photoMap.get(s.email) ?? false,
			profileValidated,
			paperValidated,
			travelValidated,
			allValidated: profileValidated && paperValidated && travelValidated,
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
