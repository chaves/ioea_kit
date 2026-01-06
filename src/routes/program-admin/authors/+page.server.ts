import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const authors = await prisma.e_auteurs.findMany({
		orderBy: { nom: 'asc' }
	});

	return { authors };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const prenom = data.get('prenom') as string;
		const nom = data.get('nom') as string;
		const instit = data.get('instit') as string;
		const home = data.get('home') as string;
		const email = data.get('email') as string;
		const photo = data.get('photo') as string;

		if (!prenom || !nom) {
			return fail(400, { error: 'First name and last name are required' });
		}

		try {
			await prisma.e_auteurs.create({
				data: {
					prenom: prenom.trim(),
					nom: nom.trim(),
					instit: instit?.trim() || '',
					home: home?.trim() || '',
					email: email?.trim() || '',
					photo: photo?.trim() || ''
				}
			});

			return { success: true, message: 'Author created successfully' };
		} catch (error) {
			console.error('Error creating author:', error);
			return fail(500, { error: 'Failed to create author' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const prenom = data.get('prenom') as string;
		const nom = data.get('nom') as string;
		const instit = data.get('instit') as string;
		const home = data.get('home') as string;
		const email = data.get('email') as string;
		const photo = data.get('photo') as string;

		if (!id || !prenom || !nom) {
			return fail(400, { error: 'ID, first name, and last name are required' });
		}

		try {
			await prisma.e_auteurs.update({
				where: { id },
				data: {
					prenom: prenom.trim(),
					nom: nom.trim(),
					instit: instit?.trim() || '',
					home: home?.trim() || '',
					email: email?.trim() || '',
					photo: photo?.trim() || ''
				}
			});

			return { success: true, message: 'Author updated successfully' };
		} catch (error) {
			console.error('Error updating author:', error);
			return fail(500, { error: 'Failed to update author' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Author ID is required' });
		}

		try {
			// Check if author has presentations
			const presentationCount = await prisma.e_presentation.count({
				where: { id_auteur: id }
			});

			if (presentationCount > 0) {
				return fail(400, {
					error: `Cannot delete author with ${presentationCount} presentation(s). Please reassign or delete the presentations first.`
				});
			}

			await prisma.e_auteurs.delete({ where: { id } });

			return { success: true, message: 'Author deleted successfully' };
		} catch (error) {
			console.error('Error deleting author:', error);
			return fail(500, { error: 'Failed to delete author' });
		}
	}
};
