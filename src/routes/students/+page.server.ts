import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { getSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || session.userType !== 'student') {
		throw redirect(302, '/students/login');
	}

	// Get student details
	const student = await prisma.students.findUnique({
		where: { id: session.userId }
	});

	if (!student) {
		throw redirect(302, '/students/login');
	}

	// Get student groups
	const groups = await prisma.students_groups.findMany({
		where: { student_id: session.userId }
	});

	// Get student papers
	const papers = await prisma.students_papers.findMany({
		where: { student_id: session.userId }
	});

	// Get student travels
	const travels = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) }
	});

	return {
		student: {
			id: student.id,
			firstName: student.first_name,
			lastName: student.last_name,
			email: student.email,
			university: student.university,
			photo: student.photo
		},
		groups: groups.map((g) => ({
			groupId: g.group_id
		})),
		papers: papers.map((p) => ({
			id: p.id,
			title: p.title,
			abstract: p.abstract
		})),
		travel: travels
			? {
					arrivalDate: travels.arrival_date_time,
					departureDate: travels.departure_date_time,
					arrivalTransfer: travels.arrival_transfer,
					departureTransfer: travels.departure_transfer
				}
			: null
	};
};
