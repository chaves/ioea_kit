import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasAnyRole } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to login page without session
	if (url.pathname === '/auth/login') {
		return { session: locals.session };
	}

	// Require authentication with admin or reviewer role
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'reviewer'])) {
		throw redirect(303, '/auth/login');
	}

	return {
		session: locals.session
	};
};

