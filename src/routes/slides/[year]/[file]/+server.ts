import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

const MIME_TYPES: Record<string, string> = {
	pdf: 'application/pdf',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const GET: RequestHandler = async ({ params }) => {
	const { year, file } = params;

	// Validate year is a 4-digit number
	if (!/^\d{4}$/.test(year)) {
		throw error(400, 'Invalid year');
	}

	// Block path traversal
	if (file.includes('..') || file.includes('/') || file.includes('\\')) {
		throw error(400, 'Invalid filename');
	}

	const filepath = join('uploads', 'presentations', year, file);

	if (!existsSync(filepath)) {
		throw error(404, 'File not found');
	}

	const ext = file.split('.').pop()?.toLowerCase() ?? '';
	const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

	const buffer = await readFile(filepath);

	return new Response(buffer, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `inline; filename="${file}"`,
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
