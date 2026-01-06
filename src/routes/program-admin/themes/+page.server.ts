import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const themes = await prisma.e_themes.findMany({
		orderBy: { date_new: 'desc' }
	});

	return { themes };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const theme = data.get('theme') as string;
		const lecwp = data.get('lecwp') as string;
		const dateNew = data.get('date_new') as string;

		if (!theme || !lecwp || !dateNew) {
			return fail(400, { error: 'Theme name, type, and date are required' });
		}

		if (lecwp !== 'lectures' && lecwp !== 'workshops') {
			return fail(400, { error: 'Type must be either "lectures" or "workshops"' });
		}

		try {
			await prisma.e_themes.create({
				data: {
					theme: theme.trim(),
					lecwp,
					date_new: new Date(dateNew)
				}
			});

			return { success: true, message: 'Theme created successfully' };
		} catch (error) {
			console.error('Error creating theme:', error);
			return fail(500, { error: 'Failed to create theme' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const theme = data.get('theme') as string;
		const lecwp = data.get('lecwp') as string;
		const dateNew = data.get('date_new') as string;

		if (!id || !theme || !lecwp || !dateNew) {
			return fail(400, { error: 'All fields are required' });
		}

		if (lecwp !== 'lectures' && lecwp !== 'workshops') {
			return fail(400, { error: 'Type must be either "lectures" or "workshops"' });
		}

		try {
			await prisma.e_themes.update({
				where: { id },
				data: {
					theme: theme.trim(),
					lecwp,
					date_new: new Date(dateNew)
				}
			});

			return { success: true, message: 'Theme updated successfully' };
		} catch (error) {
			console.error('Error updating theme:', error);
			return fail(500, { error: 'Failed to update theme' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Theme ID is required' });
		}

		try {
			// Check if theme has presentations
			const presentationCount = await prisma.e_presentation.count({
				where: { id_themes: id }
			});

			if (presentationCount > 0) {
				return fail(400, {
					error: `Cannot delete theme with ${presentationCount} presentation(s). Please reassign or delete the presentations first.`
				});
			}

			await prisma.e_themes.delete({ where: { id } });

			return { success: true, message: 'Theme deleted successfully' };
		} catch (error) {
			console.error('Error deleting theme:', error);
			return fail(500, { error: 'Failed to delete theme' });
		}
	}
};
