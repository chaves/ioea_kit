import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/db';
import { getSession } from '$lib/server/auth';
import { config } from '$lib/config';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);

	if (!session || session.userType !== 'student') {
		throw redirect(302, '/students/login');
	}

	// Get existing travel data
	const travel = await prisma.students_travels.findFirst({
		where: { student_id: String(session.userId) }
	});

	return {
		travel: travel
			? {
					arrivalDate: travel.arrival_date_time,
					departureDate: travel.departure_date_time,
					arrivalTransport: travel.arrival_transport,
					arrivalLocation: travel.arrival_location,
					arrivalFlight: travel.arrival_flight,
					arrivalTransfer: travel.arrival_transfer,
					departureTransport: travel.departure_transport,
					departureLocation: travel.departure_location,
					departureFlight: travel.departure_flight,
					departureTransfer: travel.departure_transfer
				}
			: null,
		transportOptions: config.travel.transport,
		locationOptions: config.travel.locations,
		arrivalTransferOptions: config.transfer.arrival,
		departureTransferOptions: config.transfer.departure
	};
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const session = await getSession(cookies);

		if (!session || session.userType !== 'student') {
			throw redirect(302, '/students/login');
		}

		const formData = await request.formData();

		const arrivalDate = formData.get('arrivalDate') as string;
		const arrivalTransport = formData.get('arrivalTransport') as string;
		const arrivalLocation = formData.get('arrivalLocation') as string;
		const arrivalFlight = formData.get('arrivalFlight') as string;
		const arrivalTransfer = formData.get('arrivalTransfer') as string;
		const departureDate = formData.get('departureDate') as string;
		const departureTransport = formData.get('departureTransport') as string;
		const departureLocation = formData.get('departureLocation') as string;
		const departureFlight = formData.get('departureFlight') as string;
		const departureTransfer = formData.get('departureTransfer') as string;

		const travelData = {
			arrival_date_time: arrivalDate ? new Date(arrivalDate) : new Date(),
			arrival_transport: arrivalTransport || '',
			arrival_location: arrivalLocation || '',
			arrival_flight: arrivalFlight || '',
			arrival_transfer: parseInt(arrivalTransfer) || 0,
			departure_date_time: departureDate ? new Date(departureDate) : new Date(),
			departure_transport: departureTransport || '',
			departure_location: departureLocation || '',
			departure_flight: departureFlight || '',
			departure_transfer: parseInt(departureTransfer) || 0
		};

		try {
			// Check if travel record exists
			const existingTravel = await prisma.students_travels.findFirst({
				where: { student_id: String(session.userId) }
			});

			if (existingTravel) {
				await prisma.students_travels.update({
					where: { id: existingTravel.id },
					data: travelData
				});
			} else {
				await prisma.students_travels.create({
					data: {
						...travelData,
						student_id: String(session.userId)
					}
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Error saving travel data:', err);
			return fail(500, { error: 'Failed to save travel information' });
		}
	}
};
