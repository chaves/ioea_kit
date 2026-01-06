import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to login page without session
	if (url.pathname === '/program-admin/login') {
		return { session: locals.session };
	}

	// Require program-admin authentication for all other pages
	if (!locals.session || locals.session.userType !== 'program-admin') {
		throw redirect(303, '/program-admin/login');
	}

	return {
		session: locals.session
	};
};
