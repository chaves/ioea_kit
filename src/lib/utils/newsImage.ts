export type ImageFitMode = 'cover' | 'contain';

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function clampPercent(value: unknown, fallback: number): number {
	const n = Number(value);
	if (!Number.isFinite(n)) return fallback;
	return clamp(Math.round(n), 0, 100);
}

export function normalizeImageFit(value: unknown): ImageFitMode {
	return value === 'contain' ? 'contain' : 'cover';
}

function normalizeImageSrc(src: string): string | null {
	const value = src.trim();
	if (!value) return null;
	if (value.startsWith('/')) return value;
	if (/^https?:\/\//i.test(value)) return value;
	return null;
}

export function extractFirstImageSrcFromHtml(html: string | null | undefined): string | null {
	if (!html) return null;
	const match = html.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
	if (!match?.[1]) return null;
	return normalizeImageSrc(match[1]);
}

/**
 * A news_article row reduced to what NewsCard renders: the body is dropped (it
 * can be large) after lending its first image to articles that have none.
 */
export function toNewsCard<
	T extends { content: string; image: string | null; imageFit: unknown; imageFocusX: unknown; imageFocusY: unknown }
>({ content, image, imageFit, imageFocusX, imageFocusY, ...article }: T) {
	return {
		...article,
		image: image ?? extractFirstImageSrcFromHtml(content),
		imageFit: normalizeImageFit(imageFit),
		imageFocusX: clampPercent(imageFocusX, 50),
		imageFocusY: clampPercent(imageFocusY, 28)
	};
}
