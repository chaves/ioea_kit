import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserByEmail, createPasswordResetToken, checkForgotPasswordRateLimit } from '$lib/server/auth';
import { sendEmail, passwordResetEmail } from '$lib/server/email';

export const actions: Actions = {
	default: async ({ request, url, getClientAddress }) => {
		const ip = getClientAddress();

		if (!checkForgotPasswordRateLimit(ip)) {
			return fail(429, {
				error: 'Too many attempts. Please try again in 15 minutes.',
			});
		}

		const formData = await request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();

		if (!email) {
			return fail(400, { error: 'Email is required.', email });
		}

		// Always return success message to prevent email enumeration
		const successMessage = 'If an account with this email exists, a password reset link has been sent.';

		const user = await getUserByEmail(email);

		if (user && user.active) {
			const rawToken = await createPasswordResetToken(user.id);
			const resetUrl = `${url.origin}/auth/reset-password?token=${rawToken}`;

			const emailOptions = passwordResetEmail({
				name: user.name,
				email: user.email,
				resetUrl,
			});

			await sendEmail(emailOptions);
		}

		return { success: true, message: successMessage };
	},
};
