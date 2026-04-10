/**
 * Migrates legacy presentation files from static/pdf/textes_{year}/
 * to uploads/presentations/{year}/ and updates lien field in DB.
 *
 * Old public URL: /pdf/textes_2022/Graham.pdf
 * New public URL: /slides/2022/Graham.pdf
 * The redirect route /pdf/textes_[year]/[file] issues a 301 to /slides/{year}/{file}
 * so Google-indexed URLs remain valid.
 *
 * Usage:
 *   npx tsx scripts/migrate-legacy-presentations.ts [--dry-run]
 */

import { PrismaClient } from '@prisma/client';
import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
	console.log('🔍 DRY RUN — no files will be copied, no DB updates will be made\n');
}

interface PresentationRow {
	id: number;
	lien: string | null;
	nom: string | null;
	prenom: string | null;
	date_new: Date | null;
}

async function main() {
	// Fetch all presentations that have a bare filename as lien
	const rows = await prisma.$queryRaw<PresentationRow[]>`
		SELECT
			p.id,
			p.lien,
			a.nom,
			a.prenom,
			t.date_new
		FROM e_presentation p
		LEFT JOIN e_auteurs a ON p.id_auteur = a.id
		LEFT JOIN e_themes t ON p.id_themes = t.id
		WHERE p.lien IS NOT NULL
		  AND p.lien != ''
		  AND p.lien NOT LIKE 'http%'
		  AND p.lien NOT LIKE '/%'
	`;

	console.log(`Found ${rows.length} legacy presentation(s) to migrate.\n`);

	let copied = 0;
	let skipped = 0;
	let notFound = 0;
	let errors = 0;

	for (const row of rows) {
		const filename = row.lien!.trim();
		const year = row.date_new ? new Date(row.date_new).getFullYear() : new Date().getFullYear();
		const author = `${row.prenom ?? ''} ${row.nom ?? ''}`.trim() || `id=${row.id}`;

		const srcDir = join('static', 'pdf', `textes_${year}`);
		const srcPath = join(srcDir, filename);
		const destDir = join('uploads', 'presentations', String(year));
		const destPath = join(destDir, filename);
		const newLien = `/slides/${year}/${filename}`;

		process.stdout.write(`  [${row.id}] ${author} (${year}) — ${filename} … `);

		if (!existsSync(srcPath)) {
			console.log(`❌ source not found (${srcPath})`);
			notFound++;
			continue;
		}

		if (existsSync(destPath)) {
			// File already in managed directory — just update DB lien if needed
			if (!DRY_RUN) {
				await prisma.e_presentation.update({
					where: { id: Number(row.id) },
					data: { lien: newLien }
				});
			}
			console.log(`⏭  already in uploads, lien updated to ${newLien}`);
			skipped++;
			continue;
		}

		try {
			if (!DRY_RUN) {
				if (!existsSync(destDir)) {
					await mkdir(destDir, { recursive: true });
				}
				await copyFile(srcPath, destPath);
				await prisma.e_presentation.update({
					where: { id: Number(row.id) },
					data: { lien: newLien }
				});
			}
			console.log(`✅ copied → ${newLien}`);
			copied++;
		} catch (e) {
			console.log(`💥 error: ${e}`);
			errors++;
		}
	}

	console.log('\n--- Summary ---');
	console.log(`  Copied & updated : ${copied}`);
	console.log(`  Already in uploads: ${skipped}`);
	console.log(`  Source not found : ${notFound}`);
	console.log(`  Errors           : ${errors}`);

	if (DRY_RUN) {
		console.log('\n(dry run — no changes made)');
	} else if (notFound > 0) {
		console.log(
			'\n⚠️  Some source files were not found in static/pdf/textes_{year}/.'
		);
		console.log('   These presentations will keep their legacy lien value.');
		console.log('   Check that static/pdf/ is present and up-to-date.');
	}

	if (!DRY_RUN && (copied > 0 || skipped > 0)) {
		console.log(
			'\n✅ Done. Old URLs (/pdf/textes_{year}/file) will 301-redirect to /slides/{year}/file.'
		);
	}
}

main()
	.catch((e) => {
		console.error('Fatal error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
