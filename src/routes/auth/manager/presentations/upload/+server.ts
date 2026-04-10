import { json, error } from '@sveltejs/kit';
import { hasRole } from '$lib/server/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

const ALLOWED_EXTENSIONS = ['.pdf', '.ppt', '.pptx'];

function getExtension(filename: string): string {
	const dot = filename.lastIndexOf('.');
	return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function sanitizePart(s: string): string {
	// Remove accents, then strip non-alphanumeric except hyphen
	return s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9\-]/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_|_$/g, '')
		.trim();
}

function buildFilename(lastName: string, firstName: string, year: number, ext: string): string {
	const last = sanitizePart(lastName) || 'unknown';
	const first = sanitizePart(firstName) || 'unknown';
	return `${last}_${first}_IOEA_${year}${ext}`;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw error(403, 'Forbidden');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const year = parseInt(formData.get('year') as string);
	const lastName = ((formData.get('lastName') as string) ?? '').trim();
	const firstName = ((formData.get('firstName') as string) ?? '').trim();

	if (!file || !file.name) {
		throw error(400, 'No file provided');
	}
	if (!year || year < 2000 || year > 2100) {
		throw error(400, 'Invalid year');
	}

	const ext = getExtension(file.name);
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		throw error(400, `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
	}

	const filename = lastName && firstName
		? buildFilename(lastName, firstName, year, ext)
		: file.name.replace(/[/\\?%*:|"<>]/g, '_').trim();

	const dir = join('uploads', 'presentations', String(year));

	if (!existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}

	const filepath = join(dir, filename);
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filepath, buffer);

	return json({ path: `/slides/${year}/${filename}` });
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw error(403, 'Forbidden');
	}

	const path = url.searchParams.get('path');
	if (!path || !path.startsWith('/slides/')) {
		throw error(400, 'Invalid path');
	}

	// Strip leading /slides/ to get year/filename
	const relative = path.slice('/slides/'.length);
	if (relative.includes('..')) {
		throw error(400, 'Invalid path');
	}

	const filepath = join('uploads', 'presentations', relative);
	try {
		await unlink(filepath);
	} catch {
		// File may already not exist — not a fatal error
	}

	return json({ ok: true });
};
