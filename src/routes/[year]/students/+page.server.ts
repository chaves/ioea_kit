import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { config } from '$lib/config';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { isCurrent } = await parent();
	const year = parseInt(params.year);

	// This page is only available for the current year
	if (!isCurrent) {
		throw error(404, 'Page not found');
	}

	// Check if this year has student groups open
	const isCurrentYear = year === config.currentYear;

	// Get students with their groups and papers
	let students: Array<{
		id: number;
		firstName: string;
		lastName: string;
		university: string | null;
		photo: string | null;
		groupId: number | null;
		paperTitle: string | null;
	}> = [];

	// Get seminar chairs for this year
	let chairs: Array<{
		id: number;
		firstName: string;
		lastName: string;
		institution: string | null;
		website: string | null;
		photo: string | null;
		groupId: number | null;
	}> = [];

	try {
		// Get chairs for this year
		const chairsData = await prisma.chairs.findMany({
			where: { year: year },
			orderBy: { last_name: 'asc' }
		});

		chairs = chairsData.map((c) => ({
			id: c.id,
			firstName: c.first_name ?? '',
			lastName: c.last_name ?? '',
			institution: c.instit,
			website: c.home,
			photo: c.photo,
			groupId: c.group_id
		}));

		// For current year, students are in the main 'students' table
		if (isCurrentYear) {
			// Get cancelled emails for this year to exclude them
			const cancelledSubmissions = await prisma.call_submissions.findMany({
				where: { call_year: year, cancelled: true },
				select: { email: true },
			});
			const cancelledEmails = new Set(cancelledSubmissions.map((s) => s.email));

			// Get all students from the main table, excluding cancelled
			const studentsData = await prisma.students.findMany({
				where: { email: { notIn: [...cancelledEmails] } },
				orderBy: { last_name: 'asc' }
			});

			// Get all groups
			const groups = await prisma.students_groups.findMany();

			// Get paper titles from call_submissions (students_papers is unused)
			const submissions = await prisma.call_submissions.findMany({
				where: { call_year: year, accepted: true, waitlisted: false, cancelled: false },
				select: { email: true, title: true },
			});
			const paperTitleByEmail = new Map(submissions.map((s) => [s.email, s.title]));

			// Create group map for quick lookup
			const groupMap = new Map<number, number>();
			groups.forEach((g) => {
				groupMap.set(g.student_id, g.group_id);
			});

			students = studentsData.map((s) => ({
				id: s.id,
				firstName: s.first_name ?? '',
				lastName: s.last_name ?? '',
				university: s.university,
				photo: s.photo,
				groupId: groupMap.get(s.id) ?? null,
				paperTitle: paperTitleByEmail.get(s.email) ?? null
			}));
		}
	} catch (err) {
		console.error('Error fetching students:', err);
		students = [];
	}

	// Get unique groups from students
	const groups = [...new Set(students.filter((s) => s.groupId).map((s) => s.groupId))].sort() as number[];

	return {
		year,
		students,
		chairs,
		groups,
		isCurrentYear,
		showGroups: config.studentsGroupOpen,
		showParticipants: config.showParticipants,
	};
};
