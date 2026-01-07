import type { LayoutServerLoad } from './$types';
import { getPhotoYears } from '$lib/config';
import { loadDynamicConfig } from '$lib/server/config';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function getRandomPhoto() {
	const photoYears = getPhotoYears();
	if (photoYears.length === 0) {
		return null;
	}

	// Select a random year
	const randomYear = photoYears[Math.floor(Math.random() * photoYears.length)];

	try {
		const photosDir = join(process.cwd(), 'static', 'images', 'photos', String(randomYear));
		const files = await readdir(photosDir);
		const photos = files.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

		if (photos.length === 0) {
			return null;
		}

		// Select a random photo from that year
		const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

		return {
			year: randomYear,
			filename: randomPhoto
		};
	} catch {
		return null;
	}
}

export const load: LayoutServerLoad = async ({ locals }) => {
	const randomPhoto = await getRandomPhoto();
	const dynamicConfig = await loadDynamicConfig();

	return {
		session: locals.session,
		randomPhoto,
		dynamicConfig
	};
};

