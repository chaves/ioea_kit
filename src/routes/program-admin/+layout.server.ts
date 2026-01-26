import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasRole } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to login page without session
	if (url.pathname === '/program-admin/login') {
		return { session: locals.session };
	}

	// Require program-admin role for all other pages
	if (!locals.session || !hasRole(locals.session, 'program-admin')) {
		throw redirect(303, '/program-admin/login');
	}

	return {
		session: locals.session
	};
};
