import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validateEmailChangeToken, consumeEmailChangeToken } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { error: 'Missing verification token.' };
	}

	const result = await validateEmailChangeToken(token);

	if (!result) {
		return { error: 'This link is invalid or has expired.' };
	}

	// Check the new email isn't already taken by someone else
	const existing = await prisma.users.findFirst({
		where: { email: result.newEmail, id: { not: result.userId } }
	});

	if (existing) {
		return { error: 'This email address is already in use by another account.' };
	}

	// Apply the email change
	await prisma.users.update({
		where: { id: result.userId },
		data: { email: result.newEmail }
	});

	// Mark token as used
	await consumeEmailChangeToken(token);

	// Update in-memory session if user is logged in
	if (locals.session && locals.session.userId === result.userId) {
		locals.session.email = result.newEmail;
	}

	return { success: true, newEmail: result.newEmail };
};
