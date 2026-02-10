import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasAnyRole } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to public auth pages without session
	const publicPaths = ['/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/change-password', '/auth/verify-email'];
	if (publicPaths.includes(url.pathname)) {
		return { session: locals.session };
	}

	// Require authentication with admin, program-admin, or student role
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'program-admin', 'student'])) {
		throw redirect(303, '/auth/login');
	}

	return {
		session: locals.session
	};
};

