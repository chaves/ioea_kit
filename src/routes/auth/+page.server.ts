import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to appropriate auth page based on user roles
	if (locals.session) {
		// Admins (and program-admins) primarily work in submissions.
		if (hasRole(locals.session, 'admin') || hasRole(locals.session, 'program-admin')) {
			throw redirect(302, '/auth/submissions');
		} else if (hasRole(locals.session, 'reviewer')) {
			throw redirect(302, '/auth/reviewer');
		} else if (hasRole(locals.session, 'student')) {
			throw redirect(302, '/auth/student');
		}
	}

	// Not authenticated or no recognized role, redirect to login
	throw redirect(302, '/auth/login');
};
