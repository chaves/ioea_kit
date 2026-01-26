import type { HandleClientError } from '@sveltejs/kit';

/**
 * Client-side error handler
 * Filters out known browser extension errors that don't affect functionality
 */
export const handleError: HandleClientError = ({ error, event }) => {
	// Get error message
	const errorMessage = error instanceof Error ? error.message : String(error);

	// List of known browser extension errors to suppress
	const knownExtensionErrors = [
		'A listener indicated an asynchronous response by returning true',
		'message channel closed',
		'Extension context invalidated',
		'chrome.runtime',
		'browser.runtime'
	];

	// Check if this is a known extension error
	const isExtensionError = knownExtensionErrors.some((pattern) =>
		errorMessage.toLowerCase().includes(pattern.toLowerCase())
	);

	if (isExtensionError) {
		// Log to console in development, but don't report
		if (import.meta.env.DEV) {
			console.warn('Browser extension error (suppressed):', errorMessage);
		}
		// Return a generic message and don't track
		return {
			message: 'An external browser extension caused an error (this does not affect the application)'
		};
	}

	// For real application errors, log and report
	console.error('Application error:', error);
	console.error('Event:', event);

	// Return error details for real errors
	return {
		message: error instanceof Error ? error.message : 'An unexpected error occurred',
		code: error instanceof Error && 'code' in error ? (error as any).code : undefined
	};
};
