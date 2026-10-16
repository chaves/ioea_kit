import path from 'node:path';
import { existsSync } from 'node:fs';
import { getSharp } from './sharp.js';

// Intrinsic size of a site image (/images/…), so <img> can carry width/height
// and reserve its box: without them the article text jumps when the hero image
// arrives (CLS). Uploaded files live in static/ and are mirrored into
// build/client/ (see imageStore.ts). Images are immutable, so cache forever.
const cache = new Map<string, { width: number; height: number } | null>();

export async function imageSize(url: string | null | undefined) {
	if (!url || !url.startsWith('/images/')) return null;
	if (cache.has(url)) return cache.get(url)!;
	const rel = decodeURIComponent(url.split('?')[0]);
	let size: { width: number; height: number } | null = null;
	for (const root of ['static', path.join('build', 'client')]) {
		const file = path.join(process.cwd(), root, rel);
		if (!file.startsWith(path.join(process.cwd(), root)) || !existsSync(file)) continue;
		try {
			const { width, height } = await getSharp()(file).metadata();
			if (width && height) size = { width, height };
		} catch {
			// unreadable — render without dimensions
		}
		break;
	}
	cache.set(url, size);
	return size;
}
