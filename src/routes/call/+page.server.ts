import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const countries = await prisma.countries.findMany({
		orderBy: { name: 'asc' }
	});

	return {
		countries: countries.map((c) => ({
			id: c.id,
			name: c.name
		}))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const data = await request.formData();

			// Safely extract form values with null checks
			const firstName = data.get('first_name')?.toString()?.trim() || null;
			const lastName = data.get('last_name')?.toString()?.trim() || null;
			const email = data.get('email')?.toString()?.trim()?.toLowerCase() || null;
			const nationalityStr = data.get('nationality')?.toString() || null;
			const gender = data.get('gender')?.toString() || null;
			const ageStr = data.get('age')?.toString() || null;
			const statusStr = data.get('status')?.toString() || null;
			const domain = data.get('domain')?.toString()?.trim() || null;
			const diploma = data.get('diploma')?.toString()?.trim() || null;

			// Collect values for re-population
			const values = {
				first_name: firstName ?? '',
				last_name: lastName ?? '',
				email: email ?? '',
				nationality: nationalityStr ?? '',
				gender: gender ?? '',
				age: ageStr ?? '',
				status: statusStr ?? '',
				domain: domain ?? '',
				diploma: diploma ?? ''
			};

			// Detailed validation with specific error messages
			if (!firstName || firstName.length < 2) {
				return fail(400, {
					error: 'First name is required and must be at least 2 characters long.',
					values
				});
			}

			if (!lastName || lastName.length < 2) {
				return fail(400, {
					error: 'Last name is required and must be at least 2 characters long.',
					values
				});
			}

			// Email validation
			if (!email) {
				return fail(400, { error: 'Email address is required.', values });
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return fail(400, {
					error: 'Please enter a valid email address (e.g., name@example.com).',
					values
				});
			}

			// Nationality validation
			if (!nationalityStr) {
				return fail(400, { error: 'Please select your nationality.', values });
			}

			const nationality = parseInt(nationalityStr, 10);
			if (isNaN(nationality) || nationality <= 0) {
				return fail(400, { error: 'Invalid nationality selection. Please try again.', values });
			}

			// Gender validation
			if (!gender || (gender !== 'F' && gender !== 'M')) {
				return fail(400, { error: 'Please select your gender.', values });
			}

			// Age validation
			if (!ageStr) {
				return fail(400, { error: 'Age is required.', values });
			}

			const age = parseInt(ageStr, 10);
			if (isNaN(age) || age < 18 || age > 100) {
				return fail(400, {
					error: 'Please enter a valid age between 18 and 100.',
					values
				});
			}

			// Status validation
			if (!statusStr) {
				return fail(400, { error: 'Please select your current status.', values });
			}

			const status = parseInt(statusStr, 10);
			if (isNaN(status) || status < 1 || status > 4) {
				return fail(400, { error: 'Invalid status selection. Please try again.', values });
			}

			// Domain validation
			if (!domain || domain.length < 3) {
				return fail(400, {
					error: 'Research domain is required and must be at least 3 characters long.',
					values
				});
			}

			// Diploma validation
			if (!diploma || diploma.length < 3) {
				return fail(400, {
					error: 'Highest diploma is required and must be at least 3 characters long.',
					values
				});
			}

			// Check if email already exists
			const existing = await prisma.call_proposals.findFirst({
				where: { email }
			});

			if (existing) {
				return fail(400, {
					error:
						'An application with this email address already exists. If you need to update your application, please contact us.',
					values
				});
			}

			// Store step 1 data in a cookie
			const step1Data = JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				email,
				nationality,
				gender,
				age,
				status,
				domain,
				diploma
			});

			cookies.set('call_step1', step1Data, {
				path: '/call',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 // 1 hour
			});

			throw redirect(303, '/call/step2');
		} catch (error) {
			// Handle unexpected errors
			if (error instanceof Error && error.message.includes('redirect')) {
				throw error; // Re-throw redirect errors
			}

			console.error('Form submission error:', error);
			return fail(500, {
				error:
					'An unexpected error occurred while processing your application. Please try again or contact support if the problem persists.',
				values: {}
			});
		}
	}
};

