/**
 * Utility functions for PDF to image conversion
 * 
 * NOTE: For serverless environments (Vercel), use the build script approach.
 * For environments with system dependencies, you can use pdf2pic or pdf-poppler.
 */

import { readFile, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

/**
 * Check if PDF exists and image needs to be regenerated
 * @param pdfPath - Path to PDF file (relative to static/pdf/)
 * @param imagePath - Path to image file (relative to static/images/)
 * @returns true if image needs to be generated/regenerated
 */
export async function shouldRegenerateImage(
	pdfPath: string,
	imagePath: string
): Promise<boolean> {
	const staticDir = join(process.cwd(), 'static');
	const fullPdfPath = join(staticDir, 'pdf', pdfPath);
	const fullImagePath = join(staticDir, 'images', imagePath);

	try {
		const [pdfStats, imageStats] = await Promise.all([
			stat(fullPdfPath),
			stat(fullImagePath).catch(() => null)
		]);

		// If image doesn't exist, generate it
		if (!imageStats) return true;

		// If PDF is newer than image, regenerate
		return pdfStats.mtime > imageStats.mtime;
	} catch {
		// If PDF doesn't exist, can't generate
		return false;
	}
}

/**
 * Get the PDF path for a program
 * @param year - Year of the program
 * @returns PDF filename
 */
export function getProgramPDFName(year: number): string {
	return `Programme_IOEA_${year}.pdf`;
}

/**
 * Get the image path for a program
 * @param year - Year of the program
 * @returns Image path relative to static/images/
 */
export function getProgramImagePath(year: number): string {
	return `graphiques/Programme_IOEA_${year}.jpg`;
}
