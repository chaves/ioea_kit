import { json, error } from '@sveltejs/kit';
import { hasRole } from '$lib/server/auth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

// Client sends pre-cropped 400×400 JPEG from the canvas crop modal.
// Server just sanitises the filename and writes the file — no re-processing needed.
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function getExtension(filename: string): string {
	const dot = filename.lastIndexOf('.');
	return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function sanitizePart(s: string): string {
	return s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9\-]/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_|_$/g, '')
		.trim();
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw error(403, 'Forbidden');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const lastName = ((formData.get('lastName') as string) ?? '').trim();
	const firstName = ((formData.get('firstName') as string) ?? '').trim();

	if (!file || !file.name) {
		throw error(400, 'No file provided');
	}

	const ext = getExtension(file.name);
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		throw error(400, `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
	}

	const last = sanitizePart(lastName) || 'unknown';
	const first = sanitizePart(firstName);
	// Always save as .jpg after processing
	const filename = first ? `${last}_${first}.jpg` : `${last}.jpg`;

	const dir = join('static', 'images', 'lec');
	if (!existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(join(dir, filename), buffer);

	return json({ filename });
};
