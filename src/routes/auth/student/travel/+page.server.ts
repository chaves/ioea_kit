import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { hasAnyRole } from '$lib/server/auth';
import { config } from '$lib/config';

function formatDateForInput(dt: Date | null): string {
	if (!dt || isNaN(dt.getTime()) || dt.getFullYear() < 100) return '';
	return dt.toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
		throw redirect(302, '/auth/login');
	}

	const session = locals.session;

	const travel = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) },
	});

	const validation = await prisma.students_validations.findFirst({
		where: { student_email: session.email, call_year: config.currentYear, section: 'travel' },
	});

	return {
		year: config.currentYear,
		travel: travel
			? {
					arrivalDate: formatDateForInput(travel.arrival_date_time),
					arrivalTransport: travel.arrival_transport,
					arrivalLocation: travel.arrival_location,
					arrivalFlight: travel.arrival_flight,
					arrivalTransfer: travel.arrival_transfer,
					departureDate: formatDateForInput(travel.departure_date_time),
					departureTransport: travel.departure_transport,
					departureLocation: travel.departure_location,
					departureFlight: travel.departure_flight,
					departureTransfer: travel.departure_transfer,
				}
			: null,
		validated: !!validation,
		transportOptions: config.travel.transport,
		locationOptions: config.travel.locations,
		arrivalTransferOptions: config.transfer.arrival,
		departureTransferOptions: config.transfer.departure,
	};
};

export const actions: Actions = {
	validate: async ({ locals }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.', action: 'validate' });
		}

		const travel = await prisma.students_travels.findFirst({
			where: { student_id: String(locals.session.userId) },
		});

		if (!travel || travel.arrival_date_time.getFullYear() < 100) {
			return fail(400, { error: 'Fill in your arrival date first.', action: 'validate' });
		}

		await prisma.students_validations.upsert({
			where: {
				student_email_call_year_section: {
					student_email: locals.session.email,
					call_year: config.currentYear,
					section: 'travel',
				},
			},
			create: { student_email: locals.session.email, call_year: config.currentYear, section: 'travel' },
			update: { validated_at: new Date() },
		});

		return { success: true, message: 'Travel information validated.', action: 'validate' };
	},

	default: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();

		const travelData = {
			arrival_date_time: formData.get('arrivalDate')
				? new Date(formData.get('arrivalDate') as string)
				: new Date(0),
			arrival_transport: (formData.get('arrivalTransport') as string) || '',
			arrival_location: (formData.get('arrivalLocation') as string) || '',
			arrival_flight: (formData.get('arrivalFlight') as string) || '',
			arrival_transfer: parseInt((formData.get('arrivalTransfer') as string) || '0') || 0,
			departure_date_time: formData.get('departureDate')
				? new Date(formData.get('departureDate') as string)
				: new Date(0),
			departure_transport: (formData.get('departureTransport') as string) || '',
			departure_location: (formData.get('departureLocation') as string) || '',
			departure_flight: (formData.get('departureFlight') as string) || '',
			departure_transfer: parseInt((formData.get('departureTransfer') as string) || '0') || 0,
		};

		try {
			const existing = await prisma.students_travels.findFirst({
				where: { student_id: String(locals.session.userId) },
			});
			if (existing) {
				await prisma.students_travels.update({ where: { id: existing.id }, data: travelData });
			} else {
				await prisma.students_travels.create({
					data: { ...travelData, student_id: String(locals.session.userId) },
				});
			}

			// Clear validation — must re-validate after changes
			await prisma.students_validations.deleteMany({
				where: { student_email: locals.session.email, call_year: config.currentYear, section: 'travel' },
			});

			return { success: true, message: 'Travel information saved.' };
		} catch (err) {
			console.error('Error saving travel:', err);
			return fail(500, { error: 'Failed to save travel information.' });
		}
	},
};
