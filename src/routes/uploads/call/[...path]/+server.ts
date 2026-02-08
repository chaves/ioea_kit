import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export const GET: RequestHandler = async ({ params }) => {
	const filePath = params.path;

	// Sanitize: no directory traversal
	if (!filePath || filePath.includes('..') || filePath.startsWith('/')) {
		throw error(400, 'Invalid path');
	}

	// Only allow PDF files
	if (!filePath.toLowerCase().endsWith('.pdf')) {
		throw error(403, 'Forbidden');
	}

	const fullPath = join('uploads', 'call', filePath);

	try {
		await stat(fullPath);
	} catch {
		throw error(404, 'File not found');
	}

	const file = await readFile(fullPath);
	const filename = filePath.split('/').pop() ?? 'file.pdf';

	return new Response(file, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="${filename}"`,
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
