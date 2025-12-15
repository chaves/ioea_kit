import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to login page without session
	if (url.pathname === '/admin/login') {
		return { session: locals.session };
	}

	// Require authentication for all other admin pages
	if (!locals.session || (locals.session.userType !== 'admin' && locals.session.userType !== 'reviewer')) {
		throw redirect(303, '/admin/login');
	}

	return {
		session: locals.session
	};
};

