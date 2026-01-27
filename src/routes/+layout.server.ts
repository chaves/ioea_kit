import type { LayoutServerLoad } from './$types';
import { getPhotoYears, staticConfig, getConfig } from '$lib/config';
import { readdir, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

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

async function checkProgramPDFExists(): Promise<boolean> {
	try {
		const config = getConfig();
		const pdfPath = join(process.cwd(), 'static', 'pdf', config.program.pdfName);
		await access(pdfPath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

export const load: LayoutServerLoad = async ({ locals }) => {
	const randomPhoto = await getRandomPhoto();
	const programPDFExists = await checkProgramPDFExists();

	return {
		session: locals.session,
		randomPhoto,
		programPDFExists
	};
};

