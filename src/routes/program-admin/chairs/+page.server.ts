import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const chairs = await prisma.chairs.findMany({
		orderBy: [{ year: 'desc' }, { group_id: 'asc' }]
	});

	return { chairs };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const firstName = data.get('first_name') as string;
		const lastName = data.get('last_name') as string;
		const year = parseInt(data.get('year') as string);
		const groupId = parseInt(data.get('group_id') as string);
		const instit = data.get('instit') as string;
		const home = data.get('home') as string;
		const email = data.get('email') as string;
		const photo = data.get('photo') as string;

		if (!firstName || !lastName || !year || !groupId) {
			return fail(400, { error: 'First name, last name, year, and group ID are required' });
		}

		try {
			await prisma.chairs.create({
				data: {
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					year,
					group_id: groupId,
					instit: instit?.trim() || '',
					home: home?.trim() || '',
					email: email?.trim() || '',
					photo: photo?.trim() || ''
				}
			});

			return { success: true, message: 'Chair created successfully' };
		} catch (error) {
			console.error('Error creating chair:', error);
			return fail(500, { error: 'Failed to create chair' });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const firstName = data.get('first_name') as string;
		const lastName = data.get('last_name') as string;
		const year = parseInt(data.get('year') as string);
		const groupId = parseInt(data.get('group_id') as string);
		const instit = data.get('instit') as string;
		const home = data.get('home') as string;
		const email = data.get('email') as string;
		const photo = data.get('photo') as string;

		if (!id || !firstName || !lastName || !year || !groupId) {
			return fail(400, { error: 'All required fields must be provided' });
		}

		try {
			await prisma.chairs.update({
				where: { id },
				data: {
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					year,
					group_id: groupId,
					instit: instit?.trim() || '',
					home: home?.trim() || '',
					email: email?.trim() || '',
					photo: photo?.trim() || ''
				}
			});

			return { success: true, message: 'Chair updated successfully' };
		} catch (error) {
			console.error('Error updating chair:', error);
			return fail(500, { error: 'Failed to update chair' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, { error: 'Chair ID is required' });
		}

		try {
			await prisma.chairs.delete({ where: { id } });

			return { success: true, message: 'Chair deleted successfully' };
		} catch (error) {
			console.error('Error deleting chair:', error);
			return fail(500, { error: 'Failed to delete chair' });
		}
	}
};
