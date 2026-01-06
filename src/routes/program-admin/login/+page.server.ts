import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateProgramAdminPassword, createSession, getSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);
	if (session?.userType === 'program-admin') {
		throw redirect(302, '/program-admin');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;

		if (!password) {
			return fail(400, { error: 'Password is required' });
		}

		const isValid = await validateProgramAdminPassword(password);
		if (!isValid) {
			return fail(401, { error: 'Invalid password' });
		}

		await createSession(cookies, {
			userId: 0,
			userType: 'program-admin',
			email: 'program-admin@ioea.eu',
			name: 'Program Administrator'
		});

		throw redirect(302, '/program-admin');
	}
};
