import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { config, getArchiveYears } from '$lib/config';

export const load: LayoutServerLoad = async ({ params }) => {
	const year = parseInt(params.year);

	// Validate year
	const validYears = getArchiveYears();
	if (!validYears.includes(year) && year !== config.currentYear) {
		throw error(404, 'Edition not found');
	}

	const isCurrent = year === config.currentYear;

	return {
		year,
		isCurrent,
		isCurrentYear: isCurrent // Keep for backward compatibility
	};
};

