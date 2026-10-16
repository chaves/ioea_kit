import { writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';

/**
 * PDF attachments of news articles, served at /files/news/<filename>.
 *
 * Like the news images (imageStore.ts), files are written to static/ (the
 * source of truth, copied into the next build) and mirrored into build/client/
 * so production serves them right away (server.js reads them from disk).
 */
const ROOTS = [
	{ dir: path.join('static', 'files', 'news'), optional: false },
	{ dir: path.join('build', 'client', 'files', 'news'), optional: true }
];

export async function saveNewsFile(filename: string, data: Buffer): Promise<void> {
	for (const { dir, optional } of ROOTS) {
		const abs = path.join(process.cwd(), dir);
		try {
			await mkdir(abs, { recursive: true });
			await writeFile(path.join(abs, filename), data);
		} catch (err) {
			// build/ may not exist in dev; static/ failures are real
			if (!optional) throw err;
		}
	}
}

export async function deleteNewsFile(filename: string): Promise<void> {
	// Stored names never contain a path: refuse anything that could escape the folder
	if (!filename || filename !== path.basename(filename)) return;
	for (const { dir } of ROOTS) {
		try {
			await unlink(path.join(process.cwd(), dir, filename));
		} catch {
			// not present: fine
		}
	}
}
