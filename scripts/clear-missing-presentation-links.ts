/**
 * Clears the lien field for legacy presentations whose source files
 * do not exist in static/pdf/textes_{year}/ and were not migrated.
 * This prevents 404 errors on the public presentation pages.
 *
 * Safe to run multiple times (idempotent).
 * Usage: npx tsx scripts/clear-missing-presentation-links.ts [--dry-run]
 */

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
	console.log('🔍 DRY RUN — no DB changes will be made\n');
}

interface PresentationRow {
	id: number;
	lien: string | null;
	nom: string | null;
	prenom: string | null;
	date_new: Date | null;
}

async function main() {
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

	console.log(`Found ${rows.length} presentation(s) with unresolved legacy lien.\n`);

	let cleared = 0;

	for (const row of rows) {
		const filename = row.lien!.trim();
		const year = row.date_new ? new Date(row.date_new).getFullYear() : new Date().getFullYear();
		const author = `${row.prenom ?? ''} ${row.nom ?? ''}`.trim() || `id=${row.id}`;

		// Check both possible locations
		const inStatic = existsSync(join('static', 'pdf', `textes_${year}`, filename));
		const inUploads = existsSync(join('uploads', 'presentations', String(year), filename));

		if (!inStatic && !inUploads) {
			process.stdout.write(`  [${row.id}] ${author} (${year}) — ${filename} … `);
			if (!DRY_RUN) {
				await prisma.e_presentation.update({
					where: { id: Number(row.id) },
					data: { lien: '' }
				});
			}
			console.log('🗑  lien cleared');
			cleared++;
		}
	}

	console.log(`\n--- Summary ---`);
	console.log(`  Cleared : ${cleared}`);

	if (DRY_RUN) {
		console.log('\n(dry run — no changes made)');
	} else {
		console.log('\n✅ Done. Presentations without files will no longer show a broken download link.');
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
