import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateUserCredentials, createSession, getSession, hasAnyRole, getUserByEmail } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const session = await getSession(cookies);

	if (session && hasAnyRole(session, ['admin', 'reviewer'])) {
		if (hasAnyRole(session, ['admin'])) {
			throw redirect(302, '/auth/manager');
		}
		throw redirect(302, '/auth/reviewer');
	}

	const message = url.searchParams.get('message');
	let successMessage: string | null = null;
	if (message === 'password_reset') {
		successMessage = 'Your password has been reset successfully. Please log in with your new password.';
	}

	return { successMessage };
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const user = await validateUserCredentials(email, password);

		if (!user) {
			return fail(401, { error: 'Invalid credentials', email });
		}

		// Check if user has admin or reviewer role
		if (!hasAnyRole({ roles: user.roles } as any, ['admin', 'reviewer'])) {
			return fail(403, { error: 'Access denied. Admin or reviewer role required.', email });
		}

		await createSession(cookies, {
			userId: user.userId,
			email: user.email,
			name: user.name,
			roles: user.roles,
			reviewerGroup: user.reviewerGroup,
			reviewerType: user.reviewerType
		});

		// Check if user must change their password
		const fullUser = await getUserByEmail(user.email);
		if (fullUser?.must_change_password) {
			throw redirect(302, '/auth/change-password');
		}

		if (user.roles.includes('admin')) {
			throw redirect(302, '/auth/manager');
		}
		throw redirect(302, '/auth/reviewer');
	}
};
