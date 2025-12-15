import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	// Get all lecturers with photos
	const lecturers = await prisma.e_auteurs.findMany({
		where: {
			NOT: {
				photo: ''
			}
		},
		orderBy: { nom: 'asc' }
	});

	return {
		lecturers: lecturers.map((l) => ({
			id: l.id,
			firstName: l.prenom,
			lastName: l.nom,
			institution: l.instit,
			website: l.home,
			photo: l.photo
		}))
	};
};

