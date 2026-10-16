import { writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { optimizeImageVariants } from './optimizeImage.js';

/**
 * Image persistence for admin uploads.
 *
 * Two things matter for crops to actually show up:
 *  1. The public <picture> markup (NewsCard, homepage slider…) prefers a `.webp`
 *     sibling via toWebpUrl(). So every upload MUST write a fresh `.webp` next to
 *     the `.jpg`, otherwise the browser serves a stale WebP and the new crop is
 *     never seen.
 *  2. `/images/` is served `immutable, max-age=1y` (see server.js). Reusing the
 *     same filename means the browser never re-fetches. Callers must therefore
 *     pass a unique/versioned basename so the URL changes on every upload.
 *
 * Files are written to `static/images/<subdir>` (the source of truth, survives a
 * rebuild) and best-effort mirrored into `build/client/images/<subdir>` so
 * production serves them without waiting for the next `pnpm build`.
 */

const STATIC_ROOT = path.join('static', 'images');
const BUILD_ROOT = path.join('build', 'client', 'images');
const VARIANT_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

async function writeTo(root: string, subdir: string, filename: string, data: Buffer, optional: boolean) {
	const dir = path.join(process.cwd(), root, subdir);
	try {
		await mkdir(dir, { recursive: true });
		await writeFile(path.join(dir, filename), data);
	} catch (err) {
		// build/ may not exist in dev — that's fine. static/ failures are real.
		if (!optional) throw err;
	}
}

/**
 * Optimize the source buffer and write `<basename>.jpg`, `<basename>.webp` and
 * `thumbs/<basename>.webp`.
 * Returns the public URL of the JPEG (the canonical value stored in the DB).
 */
export async function storeImageVariants(subdir: string, basename: string, source: Buffer): Promise<string> {
	const { jpeg, webp, thumb } = await optimizeImageVariants(source);
	// thumbs/ feeds the NewsCard srcset (see toThumbUrl); it must exist as soon
	// as the image is referenced, since a missing srcset candidate is not retried.
	const thumbDir = path.join(subdir, 'thumbs');
	for (const [root, optional] of [[STATIC_ROOT, false], [BUILD_ROOT, true]] as const) {
		await writeTo(root, subdir, `${basename}.jpg`, jpeg, optional);
		await writeTo(root, subdir, `${basename}.webp`, webp, optional);
		await writeTo(root, thumbDir, `${basename}.webp`, thumb, optional);
	}
	return `/images/${subdir}/${basename}.jpg`;
}

/**
 * Remove every variant (jpg/jpeg/png/webp) for a stored image URL, from both the
 * static and build trees. Best-effort — missing files are ignored.
 */
export async function deleteImageVariants(url: string | null | undefined): Promise<void> {
	if (!url) return;
	const match = url.split('?')[0].match(/^\/images\/([^/]+)\/(.+)\.[a-z]+$/i);
	if (!match) return;
	const [, subdir, name] = match;
	for (const root of [STATIC_ROOT, BUILD_ROOT]) {
		const files = [
			...VARIANT_EXTS.map((ext) => path.join(subdir, `${name}.${ext}`)),
			path.join(subdir, 'thumbs', `${name}.webp`)
		];
		for (const file of files) {
			try {
				await unlink(path.join(process.cwd(), root, file));
			} catch {
				// not present — fine
			}
		}
	}
}
