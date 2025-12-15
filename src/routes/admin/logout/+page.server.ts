import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { destroySession } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		await destroySession(cookies);
		throw redirect(303, '/admin/login');
	}
};

