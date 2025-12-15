import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	// Get all seminar chairs
	const chairs = await prisma.chairs.findMany({
		orderBy: { last_name: 'asc' }
	});

	return {
		chairs: chairs.map((c) => ({
			id: c.id,
			firstName: c.first_name,
			lastName: c.last_name,
			institution: c.instit ?? '',
			website: c.home ?? '',
			photo: c.photo ?? ''
		}))
	};
};

