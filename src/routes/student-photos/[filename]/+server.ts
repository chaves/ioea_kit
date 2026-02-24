import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;

	// Prevent path traversal
	if (!filename || /[/\\]/.test(filename)) {
		throw error(400, 'Invalid filename');
	}

	const filePath = join('uploads', 'students', 'photos', filename);

	try {
		const buffer = await readFile(filePath);
		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/jpeg',
				'Cache-Control': 'public, max-age=31536000',
			},
		});
	} catch {
		throw error(404, 'Photo not found');
	}
};
