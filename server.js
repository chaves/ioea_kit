/**
 * Server wrapper for AlwaysData hosting
 * Handles SIGUSR2 signal for graceful reloads
 */

import { createServer } from 'http';

// IMPORTANT: Set environment variables BEFORE importing the handler
// The handler reads these at import time

// Set body size limit for file uploads (12MB)
process.env.BODY_SIZE_LIMIT = process.env.BODY_SIZE_LIMIT || '12582912';

// Set ORIGIN for CSRF protection (required for form submissions in production)
// This must match the actual domain users access the site from
if (!process.env.ORIGIN) {
	process.env.ORIGIN = 'https://ioea.org';
}

// For reverse proxy setups (AlwaysData), trust forwarded headers
process.env.PROTOCOL_HEADER = process.env.PROTOCOL_HEADER || 'x-forwarded-proto';
process.env.HOST_HEADER = process.env.HOST_HEADER || 'x-forwarded-host';

// Dynamic import AFTER env vars are set
const { handler } = await import('./build/handler.js');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Create HTTP server
const server = createServer(handler);

// Track if server is shutting down
let isShuttingDown = false;

/**
 * Graceful shutdown handler
 */
function gracefulShutdown(signal) {
	if (isShuttingDown) {
		console.log('Shutdown already in progress...');
		return;
	}

	isShuttingDown = true;
	console.log(`\n${signal} received. Starting graceful shutdown...`);

	// Stop accepting new connections
	server.close((err) => {
		if (err) {
			console.error('Error during server shutdown:', err);
			process.exit(1);
		} else {
			console.log('HTTP server closed');
			console.log('Graceful shutdown completed');
			process.exit(0);
		}
	});

	// Give active connections time to finish
	// Force shutdown after 30 seconds if graceful shutdown hangs
	setTimeout(() => {
		console.error('Graceful shutdown timeout - forcing exit');
		process.exit(1);
	}, 30000);
}

// Handle SIGUSR2 for AlwaysData graceful reloads
process.on('SIGUSR2', () => {
	console.log('SIGUSR2 received - initiating graceful reload');
	gracefulShutdown('SIGUSR2');
});

// Handle other termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	gracefulShutdown('unhandledRejection');
});

// Start server
server.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log(`Node version: ${process.version}`);
	console.log(`Body size limit: ${process.env.BODY_SIZE_LIMIT} bytes`);
	console.log('Ready to accept connections');
});

// Handle server errors
server.on('error', (error) => {
	console.error('Server error:', error);
	if (error.code === 'EADDRINUSE') {
		console.error(`Port ${PORT} is already in use`);
		process.exit(1);
	}
});
