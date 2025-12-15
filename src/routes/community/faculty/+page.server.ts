import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const faculty = await prisma.e_auteurs.findMany({
		orderBy: { nom: 'asc' }
	});

	return {
		faculty: faculty.map((f) => ({
			id: f.id,
			firstName: f.prenom,
			lastName: f.nom,
			institution: f.instit,
			website: f.home,
			photo: f.photo
		}))
	};
};

