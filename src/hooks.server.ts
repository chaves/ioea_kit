import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { getSession } from '#lib/server/auth.js';

// Prevent unhandled DB/async errors from crashing the Node.js process on AlwaysData
if (!(globalThis as Record<string, unknown>).__errorHandlersRegistered) {
	(globalThis as Record<string, unknown>).__errorHandlersRegistered = true;

	process.on('uncaughtException', (err) => {
		console.error('[process] uncaughtException:', err);
	});

	process.on('unhandledRejection', (reason) => {
		console.error('[process] unhandledRejection:', reason);
	});
}

export const handleError: HandleServerError = ({ kind, error, event }) => {
	// Kit 3 also routes app/framework errors (e.g. 404) here: keep their status and message
	if (kind !== 'unknown') return;
	console.error('[handleError]', event.url.pathname, error);
	return { message: 'Internal error' };
};

export const handle: Handle = async ({ event, resolve }) => {
	// Get session from cookies
	event.locals.session = await getSession(event.cookies);

	const response = await resolve(event);

	return response;
};

