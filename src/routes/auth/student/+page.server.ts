import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';

function fmt(dt: Date | null): string {
	if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
	return dt.toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;
	const currentYear = config.currentYear;

	const submission = await prisma.call_submissions.findFirst({
		where: { email: session.email, call_year: currentYear, accepted: true, waitlisted: false },
		select: { title: true, paper: true },
	});

	const studentRecord = await prisma.students.findFirst({
		where: { email: session.email },
		select: { first_name: true, last_name: true, university: true, photo: true },
	});

	const travel = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) },
		select: { arrival_date_time: true, departure_date_time: true },
	});

	const validations = await prisma.students_validations.findMany({
		where: { student_email: session.email, call_year: currentYear },
		select: { section: true },
	});
	const validatedSections = validations.map((v) => v.section);

	return {
		year: currentYear,
		hasSubmission: !!submission,
		profile: {
			firstName: studentRecord?.first_name ?? session.name.split(' ')[0] ?? '',
			lastName: studentRecord?.last_name ?? session.name.split(' ').slice(1).join(' ') ?? '',
			photo: studentRecord?.photo ?? null,
			university: studentRecord?.university ?? '',
		},
		paper: submission
			? {
					title: submission.title ?? '',
					hasFile: !!(submission.paper && submission.paper.length > 0),
				}
			: null,
		travel: travel
			? {
					arrivalDate: fmt(travel.arrival_date_time),
					departureDate: fmt(travel.departure_date_time),
				}
			: null,
		validatedSections,
	};
};
