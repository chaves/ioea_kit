import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasAnyRole } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to public auth pages without session
	const publicPaths = ['/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/change-password'];
	if (publicPaths.includes(url.pathname)) {
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

