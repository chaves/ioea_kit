import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { hasRole } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import { unlink } from 'fs/promises';
import { join } from 'path';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth');
	}

	const [presentations, authors, themes] = await Promise.all([
		prisma.e_presentation.findMany({ orderBy: [{ id_themes: 'asc' }, { rang: 'asc' }] }),
		prisma.e_auteurs.findMany({ orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] }),
		prisma.e_themes.findMany({ orderBy: { date_new: 'desc' } }),
	]);

	return { presentations, authors, themes };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const titre = (data.get('titre') as string)?.trim();
		const resume = (data.get('resume') as string)?.trim() ?? '';
		const lien = (data.get('lien') as string)?.trim() ?? '';
		const id_auteur = parseInt(data.get('id_auteur') as string) || 0;
		const id_themes = parseInt(data.get('id_themes') as string) || 0;
		const rang = parseInt(data.get('rang') as string) || 1;

		if (!titre) {
			return fail(400, { error: 'Title is required', action: 'create' });
		}

		await prisma.e_presentation.create({
			data: { titre, resume, lien, id_auteur, id_themes, rang },
		});

		return { success: true, message: 'Presentation created.', action: 'create' };
	},

	update: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const titre = (data.get('titre') as string)?.trim();
		const resume = (data.get('resume') as string)?.trim() ?? '';
		const lien = (data.get('lien') as string)?.trim() ?? '';
		const id_auteur = parseInt(data.get('id_auteur') as string) || 0;
		const id_themes = parseInt(data.get('id_themes') as string) || 0;
		const rang = parseInt(data.get('rang') as string) || 1;

		if (!id || !titre) {
			return fail(400, { error: 'ID and title are required', action: 'update' });
		}

		await prisma.e_presentation.update({
			where: { id },
			data: { titre, resume, lien, id_auteur, id_themes, rang },
		});

		return { success: true, message: 'Presentation updated.', action: 'update' };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) return fail(400, { error: 'ID required', action: 'delete' });

		await prisma.e_presentation.delete({ where: { id } });

		return { success: true, message: 'Presentation deleted.', action: 'delete' };
	},

	updateLien: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const lien = (data.get('lien') as string)?.trim() ?? '';

		if (!id) return fail(400, { error: 'ID required', action: 'updateLien' });

		await prisma.e_presentation.update({ where: { id }, data: { lien } });

		return { success: true, message: 'File updated.', action: 'updateLien' };
	},

	deleteFile: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const lien = (data.get('lien') as string)?.trim() ?? '';

		if (!id) return fail(400, { error: 'ID required', action: 'deleteFile' });

		// Delete physical file only for managed uploads
		if (lien.startsWith('/slides/')) {
			const relative = lien.slice('/slides/'.length);
			if (!relative.includes('..')) {
				try {
					await unlink(join('uploads', 'presentations', relative));
				} catch {
					// File already missing — continue
				}
			}
		}

		await prisma.e_presentation.update({ where: { id }, data: { lien: '' } });

		return { success: true, message: 'File removed.', action: 'deleteFile' };
	},
};
