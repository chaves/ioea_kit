/**
 * Server wrapper for AlwaysData hosting
 * Handles SIGUSR2 signal for graceful reloads
 */

import { createServer } from 'http';
import { createReadStream, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname, sep } from 'node:path';

// IMPORTANT: Set environment variables BEFORE importing the handler
// The handler reads these at import time

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Set body size limit for file uploads (30MB)
process.env.BODY_SIZE_LIMIT = process.env.BODY_SIZE_LIMIT || '31457280';

// Origin: adapter-node (SvelteKit 3) ignores the ORIGIN env var at runtime;
// the public origin is baked in at build time via `paths.origin` in vite.config.ts.

// For reverse proxy setups (AlwaysData), trust forwarded headers
process.env.PROTOCOL_HEADER = process.env.PROTOCOL_HEADER || 'x-forwarded-proto';
process.env.HOST_HEADER = process.env.HOST_HEADER || 'x-forwarded-host';

// Dynamic import AFTER env vars are set
const { handler } = await import('./build/handler.js');

// News images and PDFs are uploaded at runtime into build/client (see
// src/lib/server/imageStore.ts and newsFiles.ts). adapter-node's static server
// snapshots the file list at startup, so it would answer 404 for them until the
// next restart: serve these two folders straight from disk instead.
const CLIENT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'build/client');
const UPLOAD_PREFIXES = ['/images/news/', '/files/news/'];
const CONTENT_TYPES = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.pdf': 'application/pdf'
};

function serveUpload(req, res) {
	if (req.method !== 'GET' && req.method !== 'HEAD') return false;
	let pathname;
	try {
		pathname = decodeURIComponent((req.url || '/').split('?')[0]);
	} catch {
		return false;
	}
	if (!UPLOAD_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
	const type = CONTENT_TYPES[extname(pathname).toLowerCase()];
	const abs = join(CLIENT_DIR, normalize(pathname));
	// Guard against path traversal outside build/client
	if (!type || !abs.startsWith(CLIENT_DIR + sep)) return false;

	let stats;
	try {
		stats = statSync(abs);
	} catch {
		return false;
	}
	if (!stats.isFile()) return false;

	res.setHeader('Content-Type', type);
	res.setHeader('Content-Length', stats.size);
	res.setHeader('X-Content-Type-Options', 'nosniff');
	// Image names are versioned on every upload; PDF names may be reused after a delete
	res.setHeader('Cache-Control', type === 'application/pdf' ? 'public,max-age=3600' : 'public,max-age=31536000,immutable');
	res.setHeader('Last-Modified', stats.mtime.toUTCString());
	res.statusCode = 200;
	if (req.method === 'HEAD') res.end();
	else createReadStream(abs).pipe(res);
	return true;
}

// Create HTTP server
const server = createServer((req, res) => {
	if (!serveUpload(req, res)) handler(req, res);
});

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
