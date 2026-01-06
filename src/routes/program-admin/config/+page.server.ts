import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Return configuration data
	// For now, this is a placeholder - you can extend it to load from database or config files
	return {
		siteConfig: {
			siteName: process.env.SITE_NAME || 'IOEA',
			currentYear: new Date().getFullYear(),
			adminEmail: process.env.ADMIN_EMAIL || '',
		}
	};
};
