import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasRole } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/students/login') {
		return { session: locals.session };
	}

	if (!locals.session || !hasRole(locals.session, 'student')) {
		throw redirect(303, '/students/login');
	}

	return {
		session: locals.session
	};
};

