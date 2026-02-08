import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { validateResetToken, consumeResetToken, hashPassword } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { valid: false, error: 'No reset token provided.' };
	}

	const userId = await validateResetToken(token);

	if (!userId) {
		return { valid: false, error: 'This reset link is invalid or has expired.' };
	}

	return { valid: true, token };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!token) {
			return fail(400, { error: 'Missing reset token.' });
		}

		// Re-validate the token
		const userId = await validateResetToken(token);
		if (!userId) {
			return fail(400, { error: 'This reset link is invalid or has expired.' });
		}

		if (!password || password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters long.', token });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.', token });
		}

		// Hash and update password
		const passwordHash = await hashPassword(password);

		await prisma.users.update({
			where: { id: userId },
			data: {
				password_hash: passwordHash,
				must_change_password: false,
			},
		});

		// Consume the token
		await consumeResetToken(token);

		throw redirect(303, '/auth/login?message=password_reset');
	},
};
