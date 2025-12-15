import type { PageServerLoad } from './$types';
import { config } from '$lib/config';
import { getRandomTestimonials } from '$lib/data/testimonials';
import { getRandomVideoTestimonials } from '$lib/data/videos';

export const load: PageServerLoad = async () => {
	return {
		currentYear: config.currentYear,
		testimonials: getRandomTestimonials(2),
		videoTestimonials: getRandomVideoTestimonials(2)
	};
};

