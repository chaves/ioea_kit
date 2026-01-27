/**
 * Script to generate images from PDFs (program and brochure)
 * 
 * This script converts the first page of PDFs to JPG images.
 * 
 * Usage:
 *   npx tsx scripts/generate-program-image.ts [type] [year]
 * 
 * Examples:
 *   npx tsx scripts/generate-program-image.ts program 2026
 *   npx tsx scripts/generate-program-image.ts brochure
 *   npx tsx scripts/generate-program-image.ts all
 */

import { readFile, mkdir, stat } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { staticConfig, getConfig } from '../src/lib/config';

// Try to use pdf2pic if available, otherwise fall back to manual conversion
async function convertPDFToImage(
	pdfPath: string,
	outputPath: string,
	width: number = 800,
	quality: number = 90
): Promise<void> {
	const staticDir = join(process.cwd(), 'static');
	const fullPdfPath = join(staticDir, 'pdf', pdfPath);
	const fullOutputPath = join(staticDir, 'images', outputPath);

	// Check if PDF exists
	try {
		await stat(fullPdfPath);
	} catch {
		console.warn(`   ⚠️  PDF file not found: ${fullPdfPath}`);
		console.warn('   Skipping conversion...');
		return;
	}

	console.log(`Converting PDF: ${pdfPath}`);
	console.log(`Output: ${outputPath}`);

	// Try pdf2pic first (requires GraphicsMagick and Ghostscript)
	try {
		const { fromPath } = await import('pdf2pic');
		const convert = fromPath(fullPdfPath, {
			density: 100,
			saveFilename: outputPath.split('/').pop()?.replace('.jpg', '') || 'program',
			savePath: join(fullOutputPath, '..'),
			format: 'jpg',
			width,
			height: Math.round(width * 1.414) // A4 aspect ratio
		});

		const result = await convert(1, { responseType: 'image' });
		console.log('✓ Image generated using pdf2pic');
		return;
	} catch (pdf2picError) {
		console.log('pdf2pic not available, trying alternative method...');
	}

	// Alternative: Use pdf-poppler if available
	try {
		const { execFile } = await import('child_process');
		const { promisify } = await import('util');
		const execFileAsync = promisify(execFile);

		const outputDir = join(fullOutputPath, '..');
		await mkdir(outputDir, { recursive: true });

		// Use pdftocairo to convert first page
		await execFileAsync('pdftocairo', [
			'-jpeg',
			'-f', '1',
			'-l', '1',
			'-scale-to-x', String(width),
			'-scale-to-y', '-1', // Maintain aspect ratio
			fullPdfPath,
			fullOutputPath.replace('.jpg', '')
		]);

		// Optimize with sharp
		const imageBuffer = await readFile(fullOutputPath.replace('.jpg', '-1.jpg'));
		await sharp(imageBuffer)
			.jpeg({ quality })
			.toFile(fullOutputPath);

		console.log('✓ Image generated using pdf-poppler');
		return;
	} catch (popplerError) {
		console.log('pdf-poppler not available...');
	}

	// If neither is available, provide instructions but don't fail
	console.warn('\n⚠️  No PDF conversion tool available.');
	console.warn('   PDF conversion will be skipped.');
	console.warn('\n   To enable PDF conversion, install one of:');
	console.warn('   1. pdf2pic: npm install pdf2pic');
	console.warn('   2. pdf-poppler: npm install pdf-poppler');
	console.warn('\n   Or manually convert PDFs and place images in static/images/');
	
	// Don't throw - allow build to continue
	return;
}

async function generateProgramImage(year: number): Promise<void> {
	const config = getConfig();
	const pdfPath = config.program.pdfName;
	const outputPath = config.program.imageName;

	console.log(`\n📄 Generating program image for ${year}...`);
	console.log(`   PDF: ${pdfPath}`);
	console.log(`   Output: ${outputPath}`);

	try {
		await convertPDFToImage(pdfPath, outputPath);
		console.log(`   ✅ Successfully generated: static/images/${outputPath}`);
	} catch (error) {
		console.warn(`   ⚠️  Skipped: ${error instanceof Error ? error.message : error}`);
	}
}

async function generateBrochureImage(): Promise<void> {
	const config = getConfig();
	const pdfPath = config.brochure.pdfName;
	const outputPath = config.brochure.imageName;

	console.log(`\n📄 Generating brochure image...`);
	console.log(`   PDF: ${pdfPath}`);
	console.log(`   Output: ${outputPath}`);

	try {
		await convertPDFToImage(pdfPath, outputPath);
		console.log(`   ✅ Successfully generated: static/images/${outputPath}`);
	} catch (error) {
		console.warn(`   ⚠️  Skipped: ${error instanceof Error ? error.message : error}`);
	}
}

async function main() {
	const type = process.argv[2] || 'all';
	const year = process.argv[3] ? parseInt(process.argv[3]) : staticConfig.currentYear;

	console.log('\n🖼️  PDF to Image Generator');
	console.log('='.repeat(50));

	if (type === 'all' || type === 'program') {
		await generateProgramImage(year);
	}

	if (type === 'all' || type === 'brochure') {
		await generateBrochureImage();
	}

	if (type !== 'all' && type !== 'program' && type !== 'brochure') {
		console.error(`\n❌ Unknown type: ${type}`);
		console.error('Usage: npx tsx scripts/generate-program-image.ts [program|brochure|all] [year]');
		process.exit(1);
	}

	console.log('\n✅ Generation complete!');
}

main();
