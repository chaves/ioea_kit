import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasAnyRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	return {
		session: locals.session
	};
};
