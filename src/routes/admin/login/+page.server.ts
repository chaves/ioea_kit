import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateAdminCredentials, createSession, getSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (session && (session.userType === 'admin' || session.userType === 'reviewer')) {
		if (session.reviewerType === 'manager') {
			throw redirect(302, '/admin/manager');
		}
		throw redirect(302, '/admin/reviewer');
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

		const user = await validateAdminCredentials(email, password);

		if (!user) {
			return fail(401, { error: 'Invalid credentials', email });
		}

		await createSession(cookies, {
			userId: user.userId,
			userType: user.reviewerType === 'manager' ? 'admin' : 'reviewer',
			email,
			name: user.name,
			reviewerGroup: user.reviewerGroup ?? undefined,
			reviewerType: user.reviewerType
		});

		if (user.reviewerType === 'manager') {
			throw redirect(302, '/admin/manager');
		}
		throw redirect(302, '/admin/reviewer');
	}
};
