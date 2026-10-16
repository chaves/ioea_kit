import { clampPercent, normalizeImageFit } from '#lib/utils/newsImage.js';

/** Fields shared by the "new" and "edit" news forms. */
export function parseNewsForm(data: FormData) {
	return {
		title: String(data.get('title') ?? '').trim(),
		// TipTap leaves "<p></p>" in an empty editor
		content: String(data.get('content') ?? '').replace(/^(<p><\/p>)+$/, '').trim(),
		excerpt: String(data.get('excerpt') ?? '').trim(),
		author: String(data.get('author') ?? '').trim(),
		imageFit: normalizeImageFit(data.get('imageFit')),
		imageFocusX: clampPercent(data.get('imageFocusX'), 50),
		imageFocusY: clampPercent(data.get('imageFocusY'), 28),
		published: data.get('published') === 'on'
	};
}
