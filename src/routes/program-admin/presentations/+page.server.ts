import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Fetch presentations with related data using raw SQL for better join control
	const presentations = await prisma.$queryRaw<
		Array<{
			id: number;
			id_auteur: number;
			titre: string;
			resume: string;
			lien: string;
			id_themes: number;
			rang: number;
			theme: string | null;
			lecwp: string | null;
			date_new: Date | null;
			prenom: string | null;
			nom: string | null;
		}>
	>`
		SELECT
			e_presentation.*,
			e_themes.theme,
			e_themes.lecwp,
			e_themes.date_new,
			e_auteurs.prenom,
			e_auteurs.nom
		FROM e_presentation
		LEFT JOIN e_themes ON e_presentation.id_themes = e_themes.id
		LEFT JOIN e_auteurs ON e_presentation.id_auteur = e_auteurs.id
		ORDER BY e_themes.date_new DESC, e_presentation.rang ASC
	`;

	const authors = await prisma.e_auteurs.findMany({
		orderBy: { nom: 'asc' }
	});

	const themes = await prisma.e_themes.findMany({
		orderBy: { date_new: 'desc' }
	});

	return { presentations, authors, themes };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const titre = data.get('titre') as string;
		const idAuteur = parseInt(data.get('id_auteur') as string);
		const idThemes = parseInt(data.get('id_themes') as string);
		const resume = data.get('resume') as string;
		const lien = data.get('lien') as string;
		const rang = parseInt(data.get('rang') as string) || 1;

		if (!titre || !idAuteur || !idThemes) {
			return fail(400, { error: 'Title, author, and theme are required' });
		}

		try {
			await prisma.e_presentation.create({
				data: {
					titre: titre.trim(),
					id_auteur: idAuteur,
					id_themes: idThemes,
					resume: resume?.trim() || '',
					lien: lien?.trim() || '',
					rang
				}
			});

			return { success: true, message: 'Presentation created successfully' };
		} catch (error) {
			console.error('Error creating presentation:', error);
			return fail(500, { error: 'Failed to create presentation' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const titre = data.get('titre') as string;
		const idAuteur = parseInt(data.get('id_auteur') as string);
		const idThemes = parseInt(data.get('id_themes') as string);
		const resume = data.get('resume') as string;
		const lien = data.get('lien') as string;
		const rang = parseInt(data.get('rang') as string) || 1;

		if (!id || !titre || !idAuteur || !idThemes) {
			return fail(400, { error: 'All required fields must be provided' });
		}

		try {
			await prisma.e_presentation.update({
				where: { id },
				data: {
					titre: titre.trim(),
					id_auteur: idAuteur,
					id_themes: idThemes,
					resume: resume?.trim() || '',
					lien: lien?.trim() || '',
					rang
				}
			});

			return { success: true, message: 'Presentation updated successfully' };
		} catch (error) {
			console.error('Error updating presentation:', error);
			return fail(500, { error: 'Failed to update presentation' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Presentation ID is required' });
		}

		try {
			await prisma.e_presentation.delete({ where: { id } });

			return { success: true, message: 'Presentation deleted successfully' };
		} catch (error) {
			console.error('Error deleting presentation:', error);
			return fail(500, { error: 'Failed to delete presentation' });
		}
	}
};
