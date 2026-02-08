import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getSession, hashPassword, hasAnyRole } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	return { session };
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const session = await getSession(cookies);

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!password || password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters long.' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		const passwordHash = await hashPassword(password);

		await prisma.users.update({
			where: { id: session.userId },
			data: {
				password_hash: passwordHash,
				must_change_password: false,
			},
		});

		// Redirect based on role
		if (hasAnyRole(session, ['admin'])) {
			throw redirect(303, '/auth/manager');
		}
		throw redirect(303, '/auth/reviewer');
	},
};
