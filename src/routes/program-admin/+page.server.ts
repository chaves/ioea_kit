import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	// Get counts for dashboard stats
	const [themesCount, authorsCount, chairsCount, lecturesCount, workshopsCount] = await Promise.all([
		prisma.e_themes.count(),
		prisma.e_auteurs.count(),
		prisma.chairs.count(),
		prisma.e_themes.count({ where: { lecwp: 'lectures' } }),
		prisma.e_themes.count({ where: { lecwp: 'workshops' } })
	]);

	const presentationsCount = await prisma.e_presentation.count();

	return {
		stats: {
			themesCount,
			authorsCount,
			chairsCount,
			lecturesCount,
			workshopsCount,
			presentationsCount
		}
	};
};
