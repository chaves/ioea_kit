import { config } from '$lib/config';

/**
 * Get external URL for an image file
 * @param path - Image path (with or without leading slash, e.g., "/images/photo.jpg" or "images/photo.jpg")
 * @returns Full external URL
 */
export function imageUrl(path: string): string {
	// Remove leading slash if present and remove /images/ prefix
	let cleanPath = path.startsWith('/') ? path.slice(1) : path;
	if (cleanPath.startsWith('images/')) {
		cleanPath = cleanPath.slice(7); // Remove "images/" prefix
	}
	return `${config.filesBaseUrl.images}/${cleanPath}`;
}

/**
 * Get external URL for a PDF file
 * @param path - PDF path (with or without leading slash, e.g., "/pdf/file.pdf" or "pdf/file.pdf")
 * @returns Full external URL
 */
export function pdfUrl(path: string): string {
	// Remove leading slash if present and remove /pdf/ prefix
	let cleanPath = path.startsWith('/') ? path.slice(1) : path;
	if (cleanPath.startsWith('pdf/')) {
		cleanPath = cleanPath.slice(4); // Remove "pdf/" prefix
	}
	return `${config.filesBaseUrl.pdf}/${cleanPath}`;
}

