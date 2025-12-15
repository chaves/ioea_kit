import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateStudentCredentials, createSession, getSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (session && session.userType === 'student') {
		throw redirect(302, '/students');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const user = await validateStudentCredentials(email, password);

		if (!user) {
			return fail(401, { error: 'Invalid credentials', email });
		}

		await createSession(cookies, {
			userId: user.userId,
			userType: 'student',
			email,
			name: user.name
		});

		throw redirect(302, '/students');
	}
};
