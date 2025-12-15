import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPhotoYears } from '$lib/config';
import { readdir } from 'fs/promises';
import { join } from 'path';

export const load: PageServerLoad = async ({ params }) => {
	const year = parseInt(params.year);

	// Validate year
	const validYears = getPhotoYears();
	if (!validYears.includes(year)) {
		throw error(404, 'Photos not found for this year');
	}

	// Try to list photos from the static directory
	let photos: string[] = [];
	try {
		const photosDir = join(process.cwd(), 'static', 'images', 'photos', String(year));
		const files = await readdir(photosDir);
		photos = files
			.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
			.sort();
	} catch {
		// Directory doesn't exist or is empty
		photos = [];
	}

	return {
		year,
		photos
	};
};

