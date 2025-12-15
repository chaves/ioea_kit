import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { isCurrent } = await parent();

	// This page is only available for the current year
	if (!isCurrent) {
		throw error(404, 'Page not found');
	}

	return {};
};

