import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { isCurrent } = await parent();
	const year = parseInt(params.year);

	// This page is only available for the current year
	if (!isCurrent) {
		throw error(404, 'Page not found');
	}

	// Get chairs (seminar leaders) for this year
	const chairsData = await prisma.chairs.findMany({
		where: {
			year: year
		},
		orderBy: { last_name: 'asc' }
	});

	const chairs = chairsData.map((c) => ({
		id: c.id,
		firstName: c.first_name,
		lastName: c.last_name,
		institution: c.instit ?? '',
		website: c.home ?? '',
		photo: c.photo ?? '',
		bio: ''
	}));

	return {
		year,
		chairs
	};
};

