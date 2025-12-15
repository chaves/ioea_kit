import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/students/login') {
		return { session: locals.session };
	}

	if (!locals.session || locals.session.userType !== 'student') {
		throw redirect(303, '/students/login');
	}

	return {
		session: locals.session
	};
};

