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

	const authors = await prisma.e_auteurs.findMany({ orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] });
	return { authors };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const prenom = (data.get('prenom') as string)?.trim() ?? '';
		const nom = (data.get('nom') as string)?.trim() ?? '';
		const instit = (data.get('instit') as string)?.trim() ?? '';
		const home = (data.get('home') as string)?.trim() ?? '';
		const email = (data.get('email') as string)?.trim() ?? '';
		const photo = (data.get('photo') as string)?.trim() ?? '';

		if (!nom) return fail(400, { error: 'Last name is required', action: 'create' });

		await prisma.e_auteurs.create({ data: { prenom, nom, instit, home, email, photo } });

		return { success: true, message: 'Author created.', action: 'create' };
	},

	update: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const prenom = (data.get('prenom') as string)?.trim() ?? '';
		const nom = (data.get('nom') as string)?.trim() ?? '';
		const instit = (data.get('instit') as string)?.trim() ?? '';
		const home = (data.get('home') as string)?.trim() ?? '';
		const email = (data.get('email') as string)?.trim() ?? '';
		const photo = (data.get('photo') as string)?.trim() ?? '';

		if (!id || !nom) return fail(400, { error: 'ID and last name required', action: 'update' });

		await prisma.e_auteurs.update({ where: { id }, data: { prenom, nom, instit, home, email, photo } });

		return { success: true, message: 'Author updated.', action: 'update' };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) return fail(400, { error: 'ID required', action: 'delete' });

		const author = await prisma.e_auteurs.findUnique({ where: { id } });

		await prisma.e_auteurs.delete({ where: { id } });

		if (author?.photo) {
			try {
				await unlink(join('static', 'images', 'lec', author.photo));
			} catch {
				// Photo file may not exist
			}
		}

		return { success: true, message: 'Author deleted.', action: 'delete' };
	},

	updatePhoto: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const photo = (data.get('photo') as string)?.trim() ?? '';

		if (!id) return fail(400, { error: 'ID required', action: 'updatePhoto' });

		await prisma.e_auteurs.update({ where: { id }, data: { photo } });

		return { success: true, message: 'Photo updated.', action: 'updatePhoto' };
	},
};
