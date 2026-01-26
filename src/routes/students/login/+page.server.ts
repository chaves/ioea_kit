import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateUserByEmail, createSession, getSession, hasRole } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (session && hasRole(session, 'student')) {
		throw redirect(302, '/students');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { error: 'Email is required', email });
		}

		const user = await validateUserByEmail(email);

		if (!user) {
			return fail(401, { error: 'Invalid email address', email });
		}

		// Check if user has student role
		if (!user.roles.includes('student')) {
			return fail(403, { error: 'Access denied. Student role required.', email });
		}

		await createSession(cookies, {
			userId: user.userId,
			email: user.email,
			name: user.name,
			roles: user.roles
		});

		throw redirect(302, '/students');
	}
};
