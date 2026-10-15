import type { PageServerLoad } from './$types';
import { config } from '#lib/config.js';
import { getRandomTestimonials } from '#lib/data/testimonials.js';
import { getRandomVideoTestimonials } from '#lib/data/videos.js';

export const load: PageServerLoad = async () => {
	return {
		currentYear: config.currentYear,
		testimonials: getRandomTestimonials(2),
		videoTestimonials: getRandomVideoTestimonials(4, 4)
	};
};

