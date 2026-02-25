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
	default: async ({ locals, request }) => {
		if (!locals.session || !hasAnyRole(locals.session, ['admin', 'student'])) {
			return fail(403, { error: 'Access denied.' });
		}

		const formData = await request.formData();
		const arrivalDate = formData.get('arrivalDate') as string;

		const departureDate = formData.get('departureDate') as string;
		const arrivalTransport = (formData.get('arrivalTransport') as string) || '';
		const arrivalLocation = (formData.get('arrivalLocation') as string) || '';
		const arrivalFlight = (formData.get('arrivalFlight') as string) || '';
		const arrivalTransfer = (formData.get('arrivalTransfer') as string) || '';
		const departureTransport = (formData.get('departureTransport') as string) || '';
		const departureLocation = (formData.get('departureLocation') as string) || '';
		const departureFlight = (formData.get('departureFlight') as string) || '';
		const departureTransfer = (formData.get('departureTransfer') as string) || '';

		if (!arrivalDate || !departureDate || !arrivalTransport || !arrivalLocation ||
			!arrivalFlight || !arrivalTransfer || !departureTransport || !departureLocation ||
			!departureFlight || !departureTransfer) {
			return fail(400, { error: 'All fields are required.' });
		}

		const travelData = {
			arrival_date_time: new Date(arrivalDate),
			arrival_transport: arrivalTransport,
			arrival_location: arrivalLocation,
			arrival_flight: arrivalFlight,
			arrival_transfer: parseInt(arrivalTransfer) || 0,
			departure_date_time: new Date(departureDate),
			departure_transport: departureTransport,
			departure_location: departureLocation,
			departure_flight: departureFlight,
			departure_transfer: parseInt(departureTransfer) || 0,
		};

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

		throw redirect(303, '/auth/student');
	},
};
