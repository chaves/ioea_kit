import type { PageServerLoad } from './$types';
import { prisma } from '#lib/server/db.js';
import { toNewsCard } from '#lib/utils/newsImage.js';

const PAGE_SIZE = 24;

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1') || 1);

	const [articlesRaw, total] = await prisma.$transaction([
		prisma.news_article.findMany({
			where: { published: true },
			orderBy: { publishedAt: 'desc' },
			skip: (page - 1) * PAGE_SIZE,
			take: PAGE_SIZE
		}),
		prisma.news_article.count({ where: { published: true } })
	]);

	return { articles: articlesRaw.map(toNewsCard), page, totalPages: Math.ceil(total / PAGE_SIZE), total };
};
