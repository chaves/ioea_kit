import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hasRole } from '#lib/server/auth.js';
import { prisma } from '#lib/server/db.js';
import { parseNewsForm } from '#lib/server/newsForm.js';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) throw error(404, 'Not found');
	const article = await prisma.news_article.findUnique({
		where: { id },
		include: { files: { orderBy: { createdAt: 'desc' } } }
	});
	if (!article) throw error(404, 'Article not found');

	return { article, saved: url.searchParams.get('saved') === '1' };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			throw error(403, 'Forbidden');
		}

		const id = parseInt(params.id);
		const { content, published, ...fields } = parseNewsForm(await request.formData());

		if (!fields.title || !content) {
			return fail(400, { ...fields, content, error: 'Title and content are required.' });
		}

		const current = await prisma.news_article.findUnique({ where: { id }, select: { publishedAt: true } });
		if (!current) return fail(404, { ...fields, content, error: 'Article not found.' });

		// The publication date is set the first time the article goes public, and kept afterwards
		const publishedAt = published && !current.publishedAt ? new Date() : current.publishedAt;

		await prisma.news_article.update({
			where: { id },
			data: {
				...fields,
				content,
				excerpt: fields.excerpt || null,
				author: fields.author || null,
				published,
				publishedAt
			}
		});

		throw redirect(303, `/auth/manager/news/${id}/edit?saved=1`);
	}
};
