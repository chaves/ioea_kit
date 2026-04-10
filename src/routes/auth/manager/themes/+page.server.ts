import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { hasRole } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth');
	}

	const [themes, presentationCounts] = await Promise.all([
		prisma.e_themes.findMany({ orderBy: [{ date_new: 'desc' }, { lecwp: 'asc' }] }),
		prisma.e_presentation.groupBy({ by: ['id_themes'], _count: { id: true } }),
	]);

	const countMap = new Map(presentationCounts.map((r) => [r.id_themes, r._count.id]));

	return {
		themes: themes.map((t) => ({
			...t,
			presentationCount: countMap.get(t.id) ?? 0,
		})),
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const theme = (data.get('theme') as string)?.trim();
		const lecwp = (data.get('lecwp') as string)?.trim() || 'lectures';
		const date_new = data.get('date_new') as string;

		if (!theme) return fail(400, { error: 'Theme name is required', action: 'create' });
		if (!date_new) return fail(400, { error: 'Date is required', action: 'create' });

		await prisma.e_themes.create({ data: { theme, lecwp, date_new: new Date(date_new) } });

		return { success: true, message: 'Theme created.', action: 'create' };
	},

	update: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const theme = (data.get('theme') as string)?.trim();
		const lecwp = (data.get('lecwp') as string)?.trim() || 'lectures';
		const date_new = data.get('date_new') as string;

		if (!id || !theme) return fail(400, { error: 'ID and name required', action: 'update' });
		if (!date_new) return fail(400, { error: 'Date is required', action: 'update' });

		await prisma.e_themes.update({ where: { id }, data: { theme, lecwp, date_new: new Date(date_new) } });

		return { success: true, message: 'Theme updated.', action: 'update' };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) return fail(400, { error: 'ID required', action: 'delete' });

		const count = await prisma.e_presentation.count({ where: { id_themes: id } });
		if (count > 0) {
			return fail(400, { error: `Cannot delete: ${count} presentation(s) still use this theme.`, action: 'delete' });
		}

		await prisma.e_themes.delete({ where: { id } });

		return { success: true, message: 'Theme deleted.', action: 'delete' };
	},
};
