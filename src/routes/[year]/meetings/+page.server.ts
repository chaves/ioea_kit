import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { config } from '#lib/config.js';

export const load: PageServerLoad = async ({ parent }) => {
	const { isCurrent } = await parent();

	// Only kept for the current year: past years redirect permanently so indexed URLs aren't lost
	if (!isCurrent) {
		throw redirect(301, `/${config.currentYear}/meetings`);
	}

	return {};
};

