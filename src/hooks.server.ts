import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Get session from cookies
	event.locals.session = await getSession(event.cookies);

	const response = await resolve(event);

	return response;
};

