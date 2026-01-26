import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasRole, hasAnyRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to appropriate auth page based on user roles
	if (locals.session) {
		if (hasRole(locals.session, 'admin')) {
			throw redirect(302, '/auth/manager');
		} else if (hasRole(locals.session, 'reviewer')) {
			throw redirect(302, '/auth/reviewer');
		}
	}

	// Not authenticated or no admin/reviewer role, redirect to login
	throw redirect(302, '/auth/login');
};
