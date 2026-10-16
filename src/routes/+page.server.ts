import type { PageServerLoad } from './$types';
import { config } from '#lib/config.js';
import { getRandomTestimonials } from '#lib/data/testimonials.js';
import { getRandomVideoTestimonials } from '#lib/data/videos.js';
import { prisma } from '#lib/server/db.js';
import { toNewsCard } from '#lib/utils/newsImage.js';

const HOMEPAGE_NEWS_COUNT = 3;

export const load: PageServerLoad = async () => {
	// The news block is optional: a database hiccup must not take the homepage down
	const recentNews = await prisma.news_article
		.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: HOMEPAGE_NEWS_COUNT })
		.then((rows) => rows.map(toNewsCard))
		.catch((err) => {
			console.error('[home] news unavailable:', err);
			return [];
		});

	return {
		currentYear: config.currentYear,
		testimonials: getRandomTestimonials(2),
		videoTestimonials: getRandomVideoTestimonials(4, 4),
		recentNews
	};
};
