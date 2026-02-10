import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	hasRole,
	getAllUsersWithRoles,
	createUser,
	updateUser,
	generateRandomPassword,
	createPasswordResetToken,
	hashPassword,
	createSession,
	getUserWithRolesById,
} from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import { sendEmail, welcomeUserEmail, passwordResetEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session || !hasRole(locals.session, 'admin')) {
		throw redirect(303, '/auth/login');
	}

	const users = await getAllUsersWithRoles();
	const roles = await prisma.roles.findMany({ orderBy: { name: 'asc' } });

	return {
		users,
		roles: roles.map((r) => ({ id: r.id, name: r.name })),
		session: locals.session,
	};
};

export const actions: Actions = {
	create: async ({ request, locals, url }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const roleNames = formData.getAll('roles') as string[];
		const sendWelcomeEmail = formData.get('sendEmail') === 'on';

		if (!name || !email) {
			return fail(400, { error: 'Name and email are required.', action: 'create' });
		}

		if (roleNames.length === 0) {
			return fail(400, { error: 'At least one role is required.', action: 'create' });
		}

		// Check if email already exists
		const existing = await prisma.users.findUnique({ where: { email } });
		if (existing) {
			return fail(400, { error: 'A user with this email already exists.', action: 'create' });
		}

		const temporaryPassword = generateRandomPassword();

		await createUser({
			email,
			name,
			password: temporaryPassword,
			roleNames,
			grantedBy: locals.session.userId,
		});

		if (sendWelcomeEmail) {
			const loginUrl = `${url.origin}/auth/login`;
			const emailOptions = welcomeUserEmail({
				name,
				email,
				temporaryPassword,
				loginUrl,
			});
			await sendEmail(emailOptions);
		}

		return { success: true, message: `User "${name}" created successfully.${sendWelcomeEmail ? ' Welcome email sent.' : ` Temporary password: ${temporaryPassword}`}`, action: 'create' };
	},

	update: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const userId = parseInt(formData.get('userId') as string);
		const name = (formData.get('name') as string)?.trim();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const active = formData.get('active') === 'on';
		const roleNames = formData.getAll('roles') as string[];

		if (!userId || !name || !email) {
			return fail(400, { error: 'Invalid data.', action: 'update' });
		}

		// Prevent admin from deactivating themselves
		if (userId === locals.session.userId && !active) {
			return fail(400, { error: 'You cannot deactivate your own account.', action: 'update' });
		}

		// Check email uniqueness (exclude current user)
		const existing = await prisma.users.findFirst({
			where: { email, id: { not: userId } },
		});
		if (existing) {
			return fail(400, { error: 'Another user with this email already exists.', action: 'update' });
		}

		await updateUser(userId, { name, email, active, roleNames });

		return { success: true, message: `User "${name}" updated successfully.`, action: 'update' };
	},

	resetPassword: async ({ request, locals, url }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const userId = parseInt(formData.get('userId') as string);

		if (!userId) {
			return fail(400, { error: 'Invalid user.', action: 'resetPassword' });
		}

		const user = await prisma.users.findUnique({ where: { id: userId } });
		if (!user) {
			return fail(404, { error: 'User not found.', action: 'resetPassword' });
		}

		const rawToken = await createPasswordResetToken(userId);
		const resetUrl = `${url.origin}/auth/reset-password?token=${rawToken}`;

		const emailOptions = passwordResetEmail({
			name: user.name,
			email: user.email,
			resetUrl,
		});

		await sendEmail(emailOptions);

		return { success: true, message: `Password reset email sent to ${user.email}.`, action: 'resetPassword' };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const userId = parseInt(formData.get('userId') as string);

		if (!userId) {
			return fail(400, { error: 'Invalid user.', action: 'delete' });
		}

		// Prevent admin from deleting themselves
		if (userId === locals.session.userId) {
			return fail(400, { error: 'You cannot delete your own account.', action: 'delete' });
		}

		const user = await prisma.users.findUnique({ where: { id: userId } });
		if (!user) {
			return fail(404, { error: 'User not found.', action: 'delete' });
		}

		await prisma.users.delete({ where: { id: userId } });

		return { success: true, message: `User "${user.name}" deleted successfully.`, action: 'delete' };
	},

	loginAs: async ({ request, locals, cookies, url }) => {
		if (!locals.session || !hasRole(locals.session, 'admin')) {
			return fail(403, { error: 'Access denied.', action: 'loginAs' });
		}

		const formData = await request.formData();
		const userId = parseInt(formData.get('userId') as string);

		if (!userId) {
			return fail(400, { error: 'Invalid user.', action: 'loginAs' });
		}

		if (userId === locals.session.userId) {
			return fail(400, { error: 'Use normal logout/login to switch back to your account.', action: 'loginAs' });
		}

		const user = await getUserWithRolesById(userId);
		if (!user || !user.active) {
			return fail(404, { error: 'User not found or inactive.', action: 'loginAs' });
		}

		await createSession(cookies, {
			userId: user.id,
			email: user.email,
			name: user.name,
			roles: user.roleNames,
			reviewerGroup: user.legacy_reviewer_group ?? undefined,
			reviewerType: user.roleNames.includes('admin') ? 'manager' : user.roleNames.includes('reviewer') ? 'reviewer' : undefined,
		});

		const redirectTo = user.roleNames.includes('student') ? '/students' : '/auth';
		throw redirect(303, redirectTo);
	},
};
