import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { hasRole } from '#lib/server/auth.js';
import { prisma } from '#lib/server/db.js';
import { deleteImageVariants } from '#lib/server/imageStore.js';
import { deleteNewsFile } from '#lib/server/newsFiles.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth');
	}

	const rows = await prisma.news_article.findMany({
		select: { id: true, slug: true, title: true, published: true, publishedAt: true, createdAt: true, author: true, image: true }
	});

	// Sort everything by its effective date, newest first. Drafts have no publishedAt,
	// so they fall back to createdAt instead of being pushed to the end by NULL ordering.
	const articles = rows
		.map((a) => ({ ...a, displayDate: a.publishedAt ?? a.createdAt }))
		.sort((a, b) => b.displayDate.getTime() - a.displayDate.getTime());

	return { articles };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Forbidden' });
		}

		const data = await request.formData();
		const id = parseInt(String(data.get('id')));
		if (isNaN(id)) return fail(400, { error: 'Invalid id' });

		const article = await prisma.news_article.findUnique({
			where: { id },
			select: { image: true, files: { select: { filename: true } } }
		});
		if (!article) return fail(404, { error: 'Article not found' });

		// Cascade delete handles news_file rows
		await prisma.news_article.delete({ where: { id } });

		await deleteImageVariants(article.image);
		for (const file of article.files) await deleteNewsFile(file.filename);

		return { deleted: true };
	}
};
