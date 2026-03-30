import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { isCurrent } = await parent();
	const year = parseInt(params.year);

	if (!isCurrent) {
		throw error(404, 'Page not found');
	}

	const chairsData = await prisma.chairs.findMany({
		where: { year },
		orderBy: { last_name: 'asc' }
	});

	const cancelledSubmissions = await prisma.call_submissions.findMany({
		where: { call_year: year, cancelled: true },
		select: { email: true }
	});
	const cancelledEmails = new Set(cancelledSubmissions.map((s) => s.email));

	const studentsData = await prisma.students.findMany({
		where: { email: { notIn: [...cancelledEmails] } },
		orderBy: { last_name: 'asc' }
	});

	const groupAssignments = await prisma.students_groups.findMany();
	const groupMap = new Map<number, number>();
	groupAssignments.forEach((g) => groupMap.set(g.student_id, g.group_id));

	const submissions = await prisma.call_submissions.findMany({
		where: { call_year: year, accepted: true, waitlisted: false, cancelled: false },
		select: { email: true, title: true }
	});
	const paperTitleByEmail = new Map(submissions.map((s) => [s.email, s.title]));

	const groupIds = [...new Set(chairsData.map((c) => c.group_id).filter(Boolean))].sort() as number[];

	const groups = groupIds.map((groupId) => ({
		groupId,
		chairs: chairsData
			.filter((c) => c.group_id === groupId)
			.map((c) => ({
				id: c.id,
				firstName: c.first_name,
				lastName: c.last_name,
				institution: c.instit ?? null,
				website: c.home ?? null,
				photo: c.photo ?? null
			})),
		students: studentsData
			.filter((s) => groupMap.get(s.id) === groupId)
			.map((s) => ({
				id: s.id,
				firstName: s.first_name ?? '',
				lastName: s.last_name ?? '',
				university: s.university ?? null,
				photo: s.photo ?? null,
				paperTitle: paperTitleByEmail.get(s.email) ?? null
			}))
	}));

	return { year, groups };
};
