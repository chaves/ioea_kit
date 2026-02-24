import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';
import { writeFile, mkdir, copyFile, access } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = join('uploads', 'students', 'photos');
const PAPERS_DIR = join('uploads', 'students', String(config.currentYear));
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8 MB input
const MAX_PAPER_SIZE = 5 * 1024 * 1024; // 5 MB

function formatDateForInput(dt: Date | null): string {
	if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
	return dt.toISOString().slice(0, 10);
}

function slugify(email: string): string {
	return email.replace(/[@.]/g, '-').replace(/[^a-z0-9-]/gi, '');
}

async function clearValidation(email: string, year: number, section: string) {
	await prisma.students_validations.deleteMany({
		where: { student_email: email, call_year: year, section },
	});
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;
	const currentYear = config.currentYear;

	const submission = await prisma.call_submissions.findFirst({
		where: { email: session.email, call_year: currentYear, accepted: true, waitlisted: false },
		select: { title: true, summary: true, paper: true },
	});

	// students record holds editable profile fields
	const studentRecord = await prisma.students.findFirst({
		where: { email: session.email },
		select: { id: true, first_name: true, last_name: true, university: true, photo: true },
	});

	const travel = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) },
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
			email: session.email,
			university: studentRecord?.university ?? '',
			photo: studentRecord?.photo ?? null,
		},
		paper: submission
			? {
					title: submission.title ?? '',
					summary: submission.summary ?? '',
					hasFile: !!(submission.paper && submission.paper.length > 0),
				}
			: null,
		travel: travel
			? {
					arrivalDate: formatDateForInput(travel.arrival_date_time),
					arrivalTransport: travel.arrival_transport,
					arrivalLocation: travel.arrival_location,
					arrivalFlight: travel.arrival_flight,
					arrivalTransfer: travel.arrival_transfer,
					departureDate: formatDateForInput(travel.departure_date_time),
					departureTransport: travel.departure_transport,
					departureLocation: travel.departure_location,
					departureFlight: travel.departure_flight,
					departureTransfer: travel.departure_transfer,
				}
			: null,
		validatedSections,
		transportOptions: config.travel.transport,
		locationOptions: config.travel.locations,
		arrivalTransferOptions: config.transfer.arrival,
		departureTransferOptions: config.transfer.departure,
	};
};

export const actions: Actions = {
	updateProfile: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'updateProfile' });
		}

		const formData = await request.formData();
		const firstName = (formData.get('firstName') as string)?.trim() ?? '';
		const lastName = (formData.get('lastName') as string)?.trim() ?? '';
		const university = (formData.get('university') as string)?.trim() ?? '';
		const photoFile = formData.get('photo') as File | null;

		if (!firstName || !lastName) {
			return fail(400, { error: 'First and last name are required.', action: 'updateProfile' });
		}

		const studentRecord = await prisma.students.findFirst({
			where: { email: locals.session.email },
		});

		if (!studentRecord) {
			return fail(404, { error: 'Student record not found. Please contact the coordinator.', action: 'updateProfile' });
		}

		const updateData: { first_name: string; last_name: string; university: string; photo?: string } = {
			first_name: firstName,
			last_name: lastName,
			university,
		};

		// Handle photo upload
		if (photoFile && photoFile.size > 0) {
			if (photoFile.size > MAX_PHOTO_SIZE) {
				return fail(400, { error: 'Photo must be less than 8 MB.', action: 'updateProfile' });
			}

			const type = photoFile.type;
			if (!['image/jpeg', 'image/png', 'image/webp'].includes(type)) {
				return fail(400, { error: 'Photo must be JPEG, PNG, or WebP.', action: 'updateProfile' });
			}

			await mkdir(PHOTOS_DIR, { recursive: true });

			const slug = slugify(locals.session.email);
			const filename = `${slug}.jpg`;
			const outputPath = join(PHOTOS_DIR, filename);

			const buffer = Buffer.from(await photoFile.arrayBuffer());
			const processed = await sharp(buffer)
				.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
				.jpeg({ quality: 85 })
				.toBuffer();

			await writeFile(outputPath, processed);
			updateData.photo = filename;
		}

		await prisma.students.update({
			where: { id: studentRecord.id },
			data: updateData,
		});

		// Keep users.name in sync
		await prisma.users.update({
			where: { id: locals.session.userId },
			data: { name: `${firstName} ${lastName}` },
		});

		// Clear profile validation — student must re-validate after changes
		await clearValidation(locals.session.email, config.currentYear, 'profile');

		return { success: true, message: 'Profile saved.', action: 'updateProfile' };
	},

	updatePaper: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'updatePaper' });
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim() ?? '';
		const summary = (formData.get('summary') as string)?.trim() ?? '';
		const paperFile = formData.get('paperFile') as File | null;

		const submission = await prisma.call_submissions.findFirst({
			where: { email: locals.session.email, call_year: config.currentYear, accepted: true, waitlisted: false },
		});

		if (!submission) {
			return fail(404, { error: 'No accepted submission found.', action: 'updatePaper' });
		}

		const updateData: { title: string; summary: string; paper?: string } = { title, summary };

		if (paperFile && paperFile.size > 0) {
			if (paperFile.size > MAX_PAPER_SIZE) {
				return fail(400, { error: 'File must be less than 5 MB.', action: 'updatePaper' });
			}
			if (!paperFile.name.toLowerCase().endsWith('.pdf')) {
				return fail(400, { error: 'File must be a PDF.', action: 'updatePaper' });
			}

			await mkdir(PAPERS_DIR, { recursive: true });

			const slug = slugify(locals.session.email);
			const filename = `${slug}-paper.pdf`;
			const buffer = Buffer.from(await paperFile.arrayBuffer());
			await writeFile(join(PAPERS_DIR, filename), buffer);

			updateData.paper = filename;
		}

		await prisma.call_submissions.update({
			where: { id: submission.id },
			data: updateData,
		});

		// Clear paper validation — student must re-validate after changes
		await clearValidation(locals.session.email, config.currentYear, 'paper');

		return { success: true, message: 'Paper information saved.', action: 'updatePaper' };
	},

	updateTravel: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'updateTravel' });
		}

		const formData = await request.formData();

		const travelData = {
			arrival_date_time: formData.get('arrivalDate')
				? new Date(formData.get('arrivalDate') as string)
				: new Date(0),
			arrival_transport: (formData.get('arrivalTransport') as string) || '',
			arrival_location: (formData.get('arrivalLocation') as string) || '',
			arrival_flight: (formData.get('arrivalFlight') as string) || '',
			arrival_transfer: parseInt((formData.get('arrivalTransfer') as string) || '0') || 0,
			departure_date_time: formData.get('departureDate')
				? new Date(formData.get('departureDate') as string)
				: new Date(0),
			departure_transport: (formData.get('departureTransport') as string) || '',
			departure_location: (formData.get('departureLocation') as string) || '',
			departure_flight: (formData.get('departureFlight') as string) || '',
			departure_transfer: parseInt((formData.get('departureTransfer') as string) || '0') || 0,
		};

		try {
			const existing = await prisma.students_travels.findFirst({
				where: { student_id: String(locals.session.userId) },
			});
			if (existing) {
				await prisma.students_travels.update({ where: { id: existing.id }, data: travelData });
			} else {
				await prisma.students_travels.create({
					data: { ...travelData, student_id: String(locals.session.userId) },
				});
			}

			// Clear travel validation — student must re-validate after changes
			await clearValidation(locals.session.email, config.currentYear, 'travel');

			return { success: true, message: 'Travel information saved.', action: 'updateTravel' };
		} catch (err) {
			console.error('Error saving travel:', err);
			return fail(500, { error: 'Failed to save travel information.', action: 'updateTravel' });
		}
	},

	validateProfile: async ({ locals }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'validateProfile' });
		}

		await prisma.students_validations.upsert({
			where: {
				student_email_call_year_section: {
					student_email: locals.session.email,
					call_year: config.currentYear,
					section: 'profile',
				},
			},
			create: {
				student_email: locals.session.email,
				call_year: config.currentYear,
				section: 'profile',
			},
			update: { validated_at: new Date() },
		});

		return { success: true, message: 'Profile validated.', action: 'validateProfile' };
	},

	validatePaper: async ({ locals }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'validatePaper' });
		}

		// If the student has not re-uploaded their paper, copy the original call
		// submission file into the student files directory.
		const submission = await prisma.call_submissions.findFirst({
			where: { email: locals.session.email, call_year: config.currentYear, accepted: true, waitlisted: false },
			select: { id: true, paper: true },
		});

		if (submission?.paper) {
			const slug = slugify(locals.session.email);
			const studentFilename = `${slug}-paper.pdf`;
			const studentPath = join(PAPERS_DIR, studentFilename);

			try {
				await access(studentPath);
				// File already in student directory — nothing to copy
			} catch {
				// Not in student directory — try to copy from call directory
				const callPath = join('uploads', 'call', String(config.currentYear), submission.paper);
				try {
					await access(callPath);
					await mkdir(PAPERS_DIR, { recursive: true });
					await copyFile(callPath, studentPath);
					// Update submission to point to the slug-based student filename
					await prisma.call_submissions.update({
						where: { id: submission.id },
						data: { paper: studentFilename },
					});
				} catch {
					// Source file not found — leave as-is
				}
			}
		}

		await prisma.students_validations.upsert({
			where: {
				student_email_call_year_section: {
					student_email: locals.session.email,
					call_year: config.currentYear,
					section: 'paper',
				},
			},
			create: {
				student_email: locals.session.email,
				call_year: config.currentYear,
				section: 'paper',
			},
			update: { validated_at: new Date() },
		});

		return { success: true, message: 'Paper validated.', action: 'validatePaper' };
	},

	validateTravel: async ({ locals }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'validateTravel' });
		}

		await prisma.students_validations.upsert({
			where: {
				student_email_call_year_section: {
					student_email: locals.session.email,
					call_year: config.currentYear,
					section: 'travel',
				},
			},
			create: {
				student_email: locals.session.email,
				call_year: config.currentYear,
				section: 'travel',
			},
			update: { validated_at: new Date() },
		});

		return { success: true, message: 'Travel information validated.', action: 'validateTravel' };
	},
};
