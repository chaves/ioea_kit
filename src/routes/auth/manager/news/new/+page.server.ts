import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hasRole } from '#lib/server/auth.js';
import { prisma } from '#lib/server/db.js';
import { parseNewsForm } from '#lib/server/newsForm.js';
import { slugify } from '#lib/utils/news.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			throw error(403, 'Forbidden');
		}

		const { content, published, ...fields } = parseNewsForm(await request.formData());

		if (!fields.title || !content) {
			return fail(400, { ...fields, content, error: 'Title and content are required.' });
		}

		// Ensure uniqueness
		let slug = slugify(fields.title) || 'news';
		if (await prisma.news_article.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;

		const article = await prisma.news_article.create({
			data: {
				...fields,
				slug,
				content,
				excerpt: fields.excerpt || null,
				author: fields.author || null,
				published,
				publishedAt: published ? new Date() : null
			}
		});

		throw redirect(303, `/auth/manager/news/${article.id}/edit?saved=1`);
	}
};
