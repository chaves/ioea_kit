import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '#lib/server/db.js';
import { toNewsCard } from '#lib/utils/newsImage.js';
import { imageSize } from '#lib/server/imageSize.js';

const MORE_NEWS_COUNT = 2;

export const load: PageServerLoad = async ({ params }) => {
	const [article, latest] = await Promise.all([
		prisma.news_article.findUnique({
			where: { slug: params.slug, published: true },
			include: { files: { orderBy: { createdAt: 'asc' } } }
		}),
		// One extra, so the list is still full after dropping the current article.
		prisma.news_article.findMany({
			where: { published: true },
			orderBy: { publishedAt: 'desc' },
			take: MORE_NEWS_COUNT + 1
		})
	]);
	if (!article) throw error(404, 'Article not found');

	return {
		article,
		imageSize: await imageSize(article.image),
		moreNews: latest
			.filter((a) => a.id !== article.id)
			.slice(0, MORE_NEWS_COUNT)
			.map(toNewsCard)
	};
};
