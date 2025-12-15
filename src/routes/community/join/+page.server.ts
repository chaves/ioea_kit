import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;

		if (!email) {
			return fail(400, { error: 'Email is required', email, firstName, lastName });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Invalid email format', email, firstName, lastName });
		}

		// For now, just log the submission
		// In production, you'd save to database or send to mailing list service
		console.log(`Newsletter signup: ${firstName} ${lastName} <${email}>`);

		return { success: true };
	}
};
