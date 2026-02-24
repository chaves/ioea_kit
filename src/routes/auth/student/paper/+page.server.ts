import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';
import { writeFile, mkdir, copyFile, access } from 'fs/promises';
import { join } from 'path';

const PAPERS_DIR = join('uploads', 'students', String(config.currentYear));
const MAX_PAPER_SIZE = 5 * 1024 * 1024;

function slugify(email: string): string {
	return email.replace(/[@.]/g, '-').replace(/[^a-z0-9-]/gi, '');
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;

	const submission = await prisma.call_submissions.findFirst({
		where: { email: session.email, call_year: config.currentYear, accepted: true, waitlisted: false },
		select: { title: true, summary: true, paper: true },
	});

	if (!submission) {
		throw redirect(302, '/auth/student');
	}

	const validation = await prisma.students_validations.findFirst({
		where: { student_email: session.email, call_year: config.currentYear, section: 'paper' },
	});

	return {
		year: config.currentYear,
		paper: {
			title: submission.title ?? '',
			summary: submission.summary ?? '',
			hasFile: !!(submission.paper && submission.paper.length > 0),
		},
		validated: !!validation,
	};
};

export const actions: Actions = {
	validate: async ({ locals }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'validate' });
		}

		const submission = await prisma.call_submissions.findFirst({
			where: { email: locals.session.email, call_year: config.currentYear, accepted: true, waitlisted: false },
			select: { id: true, title: true, paper: true },
		});

		if (!submission?.title || !submission?.paper) {
			return fail(400, { error: 'Add a title and upload a file first.', action: 'validate' });
		}

		// Copy from call dir to student dir if not already there
		const slug = slugify(locals.session.email);
		const studentFilename = `${slug}-paper.pdf`;
		const studentPath = join(PAPERS_DIR, studentFilename);

		try {
			await access(studentPath);
		} catch {
			const callPath = join('uploads', 'call', String(config.currentYear), submission.paper);
			try {
				await access(callPath);
				await mkdir(PAPERS_DIR, { recursive: true });
				await copyFile(callPath, studentPath);
				await prisma.call_submissions.update({
					where: { id: submission.id },
					data: { paper: studentFilename },
				});
			} catch {
				// Source not found — leave as-is
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
			create: { student_email: locals.session.email, call_year: config.currentYear, section: 'paper' },
			update: { validated_at: new Date() },
		});

		return { success: true, message: 'Paper validated.', action: 'validate' };
	},

	default: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim() ?? '';
		const summary = (formData.get('summary') as string)?.trim() ?? '';
		const paperFile = formData.get('paperFile') as File | null;

		const submission = await prisma.call_submissions.findFirst({
			where: { email: locals.session.email, call_year: config.currentYear, accepted: true, waitlisted: false },
		});

		if (!submission) {
			return fail(404, { error: 'No accepted submission found.' });
		}

		const updateData: { title: string; summary: string; paper?: string } = { title, summary };

		if (paperFile && paperFile.size > 0) {
			if (paperFile.size > MAX_PAPER_SIZE) {
				return fail(400, { error: 'File must be less than 5 MB.' });
			}
			if (!paperFile.name.toLowerCase().endsWith('.pdf')) {
				return fail(400, { error: 'File must be a PDF.' });
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

		// Clear validation — must re-validate after changes
		await prisma.students_validations.deleteMany({
			where: { student_email: locals.session.email, call_year: config.currentYear, section: 'paper' },
		});

		return { success: true, message: 'Paper information saved.' };
	},
};
