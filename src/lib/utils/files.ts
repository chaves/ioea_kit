/**
 * Get local path for a PDF file
 * @param path - PDF path (with or without leading slash, e.g., "/pdf/file.pdf" or "pdf/file.pdf")
 * @returns Local path for SvelteKit static files
 */
export function pdfUrl(path: string): string {
	// Ensure path starts with /
	if (!path.startsWith('/')) {
		path = '/' + path;
	}
	// Ensure it starts with /pdf/ if it's just a filename
	if (!path.startsWith('/pdf/')) {
		// If it's just a filename, assume it's in /pdf/
		if (!path.includes('/')) {
			path = '/pdf/' + path;
		}
	}
	return path;
}

