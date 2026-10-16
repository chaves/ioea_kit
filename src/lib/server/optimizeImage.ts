import { getSharp } from './sharp.js';

const DEFAULT_MAX_EDGE = 1200;
const THUMB_WIDTH = 800;

/** Resize for web delivery while preserving the uploaded aspect ratio. */
export async function optimizeImageBuffer(buffer: Buffer, maxEdge = DEFAULT_MAX_EDGE) {
	const sharp = await getSharp();
	return sharp(buffer)
		.resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: 85, progressive: true })
		.toBuffer();
}

/**
 * Produce JPEG + WebP web-optimized variants from one source buffer, preserving
 * aspect ratio. The WebP is required because the public <picture> markup prefers
 * the `.webp` sibling (see NewsCard / toWebpUrl) — writing only a JPEG leaves a
 * stale WebP in place and the new crop is never shown.
 */
export async function optimizeImageVariants(buffer: Buffer, maxEdge = DEFAULT_MAX_EDGE) {
	const sharp = await getSharp();
	const base = sharp(buffer).resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true });
	const [jpeg, webp, thumb] = await Promise.all([
		base.clone().jpeg({ quality: 85, progressive: true }).toBuffer(),
		base.clone().webp({ quality: 82 }).toBuffer(),
		// Card-sized WebP for the NewsCard srcset (same width as generate-thumbs.mjs).
		sharp(buffer)
			.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
			.webp({ quality: 82 })
			.toBuffer()
	]);
	return { jpeg, webp, thumb };
}
