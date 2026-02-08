import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateUserCredentials, createSession, getSession, hasAnyRole, getUserByEmail } from '$lib/server/auth';

function getRedirectForRoles(roles: string[]): string {
	if (roles.includes('admin')) return '/auth/manager/users';
	if (roles.includes('program-admin')) return '/auth/submissions';
	if (roles.includes('student')) return '/auth/student';
	return '/auth/login';
}

export const load: PageServerLoad = async ({ cookies, url }) => {
	const session = await getSession(cookies);

	if (session && hasAnyRole(session, ['admin', 'program-admin', 'student'])) {
		throw redirect(302, getRedirectForRoles(session.roles));
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

		// Check if user has an allowed role
		if (!hasAnyRole({ roles: user.roles } as any, ['admin', 'program-admin', 'student'])) {
			return fail(403, { error: 'Access denied. You do not have the required role.', email });
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

		throw redirect(302, getRedirectForRoles(user.roles));
	}
};
