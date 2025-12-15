import type { PageServerLoad } from './$types';
import { getArchiveYears } from '$lib/config';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function getPhotoForYear(year: number): Promise<string | null> {
	try {
		const photosDir = join(process.cwd(), 'static', 'images', 'photos', String(year));
		const files = await readdir(photosDir);
		const photos = files.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

		if (photos.length === 0) {
			return null;
		}

		// Return a random photo from the year
		const randomIndex = Math.floor(Math.random() * photos.length);
		return photos[randomIndex];
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async () => {
	const years = getArchiveYears();

	// Load a photo for each year
	const yearsWithPhotos = await Promise.all(
		years.map(async (year) => {
			const photo = await getPhotoForYear(year);
			return {
				year,
				photo
			};
		})
	);

	return {
		yearsWithPhotos
	};
};

