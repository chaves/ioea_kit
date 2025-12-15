import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { isCurrent } = await parent();
	const year = parseInt(params.year);
	const studentId = parseInt(params.id);

	// This page is only available for the current year
	if (!isCurrent) {
		throw error(404, 'Page not found');
	}

	if (isNaN(studentId)) {
		throw error(404, 'Invalid student ID');
	}

	try {
		// Get student data
		const student = await prisma.students.findUnique({
			where: { id: studentId }
		});

		if (!student) {
			throw error(404, 'Student not found');
		}

		// Get student's paper
		const paper = await prisma.students_papers.findFirst({
			where: { student_id: studentId }
		});

		// Get student's group
		const group = await prisma.students_groups.findFirst({
			where: {
				student_id: studentId
			}
		});

		// Get country name from residence field
		let countryName: string | null = null;
		if (student.residence) {
			try {
				const country = await prisma.countries.findUnique({
					where: { id: student.residence }
				});
				countryName = country?.name ?? null;
			} catch {
				// Country lookup failed, ignore
			}
		}

		// Get nationality name
		let nationalityName: string | null = null;
		if (student.nationality) {
			try {
				const natCountry = await prisma.countries.findUnique({
					where: { id: student.nationality }
				});
				nationalityName = natCountry?.name ?? null;
			} catch {
				// Nationality lookup failed, ignore
			}
		}

		return {
			year,
			student: {
				id: student.id,
				firstName: student.first_name ?? '',
				lastName: student.last_name ?? '',
				email: student.email,
				university: student.university,
				country: countryName,
				nationality: nationalityName,
				photo: student.photo
			},
			paper: paper
				? {
						title: paper.title,
						abstract: paper.abstract,
						file: paper.file
					}
				: null,
			groupId: group?.group_id ?? null
		};
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		console.error('Error fetching student:', err);
		throw error(500, 'Failed to load student information');
	}
};

