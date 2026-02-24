import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { hasAnyRole } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import { config } from '$lib/config';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const submission = await prisma.call_submissions.findFirst({
		where: {
			email: locals.session.email,
			call_year: config.currentYear,
			accepted: true,
			waitlisted: false,
		},
		select: { paper: true, first_name: true, last_name: true },
	});

	if (!submission?.paper) {
		throw error(404, 'No paper on file');
	}

	const year = String(config.currentYear);
	const filename = submission.paper;

	// Try student re-upload dir first, then original call upload dir
	const candidates = [
		join('uploads', 'students', year, filename),
		join('uploads', 'call', year, filename),
	];

	let buffer: Buffer | null = null;
	for (const path of candidates) {
		try {
			await access(path);
			buffer = await readFile(path);
			break;
		} catch {
			// try next
		}
	}

	if (!buffer) {
		throw error(404, 'Paper file not found on server');
	}

	const displayName = `${submission.last_name}_${submission.first_name}_paper.pdf`;

	return new Response(buffer as unknown as BodyInit, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${displayName}"`,
		},
	});
};
