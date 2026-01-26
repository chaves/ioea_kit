/**
 * Script to update e_auteurs table from CSV file
 * Checks if authors exist by prenom and nom, updates instit if needed, inserts new ones
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface CSVRow {
	prenom: string;
	nom: string;
	instit: string;
	home: string;
}

interface Change {
	type: 'insert' | 'update' | 'no_change';
	prenom: string;
	nom: string;
	oldInstit?: string;
	newInstit?: string;
	oldHome?: string;
	home?: string;
	id?: number;
}

function parseCSV(filePath: string): CSVRow[] {
	const content = readFileSync(filePath, 'utf-8');
	const lines = content.split('\n').filter((line) => line.trim());
	const headers = lines[0].split(',').map((h) => h.trim());
	
	// Find column indices
	const prenomIdx = headers.indexOf('prenom');
	const nomIdx = headers.indexOf('nom');
	const institIdx = headers.indexOf('instit');
	const homeIdx = headers.indexOf('home');

	if (prenomIdx === -1 || nomIdx === -1 || institIdx === -1 || homeIdx === -1) {
		throw new Error('CSV must contain columns: prenom, nom, instit, home');
	}

	const rows: CSVRow[] = [];
	
	// Parse CSV rows - handle fields that may contain commas
	for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
		const line = lines[lineIdx];
		if (!line.trim()) continue;

		// Parse CSV with proper handling of encoded quotes (+ACI-)
		const values: string[] = [];
		let current = '';
		let inQuotedField = false;
		let charIdx = 0;

		while (charIdx < line.length) {
			const remaining = line.substring(charIdx);
			
			// Check for encoded quote marker +ACI-
			if (remaining.startsWith('+ACI-')) {
				if (!inQuotedField) {
					// Starting a quoted field - skip the marker
					inQuotedField = true;
					charIdx += 5;
					continue;
				} else {
					// Ending a quoted field - skip the marker and add the field
					inQuotedField = false;
					values.push(current.trim());
					current = '';
					charIdx += 5;
					// Skip the comma after the closing quote if present
					if (charIdx < line.length && line[charIdx] === ',') {
						charIdx++;
					}
					continue;
				}
			}

			const char = line[charIdx];
			
			if (inQuotedField) {
				// Inside a quoted field - collect all characters including commas
				current += char;
			} else if (char === ',') {
				// Field separator
				values.push(current.trim());
				current = '';
			} else {
				current += char;
			}
			
			charIdx++;
		}
		
		// Add the last field
		if (current.trim() || values.length < 4) {
			values.push(current.trim());
		}

		// Ensure we have at least 4 values
		while (values.length < 4) {
			values.push('');
		}

		// Decode HTML entities and clean up
		const prenom = decodeEntities(values[prenomIdx] || '').trim();
		const nom = decodeEntities(values[nomIdx] || '').trim();
		const instit = decodeEntities(values[institIdx] || '').trim();
		const home = decodeEntities(values[homeIdx] || '').trim();

		if (prenom && nom) {
			rows.push({ prenom, nom, instit, home });
		}
	}

	return rows;
}

function decodeEntities(text: string): string {
	// Decode common HTML entities found in the CSV
	return text
		.replace(/\+ACI-/g, '"')
		.replace(/\+AC0-/g, '-')
		.replace(/\+ACY-/g, '&')
		.replace(/\+ACU-/g, '?')
		.replace(/\+AD0-/g, '=')
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
}

async function processAuthors(csvPath: string) {
	console.log('Reading CSV file...\n');
	const csvRows = parseCSV(csvPath);
	console.log(`Found ${csvRows.length} authors in CSV\n`);

	const changes: Change[] = [];
	let insertCount = 0;
	let updateCount = 0;
	let noChangeCount = 0;

	for (const row of csvRows) {
		// Check if author exists by prenom and nom
		const existing = await prisma.e_auteurs.findFirst({
			where: {
				prenom: row.prenom,
				nom: row.nom
			}
		});

		if (existing) {
			// Author exists - check if instit or home needs updating
			const needsInstitUpdate = existing.instit !== row.instit;
			const needsHomeUpdate = row.home && existing.home !== row.home;
			
			if (needsInstitUpdate || needsHomeUpdate) {
				const updateData: { instit?: string; home?: string } = {};
				if (needsInstitUpdate) {
					updateData.instit = row.instit;
				}
				if (needsHomeUpdate) {
					updateData.home = row.home;
				}

				await prisma.e_auteurs.update({
					where: { id: existing.id },
					data: updateData
				});

				changes.push({
					type: 'update',
					prenom: row.prenom,
					nom: row.nom,
					oldInstit: existing.instit,
					newInstit: row.instit,
					oldHome: existing.home,
					home: row.home || existing.home,
					id: existing.id
				});
				updateCount++;
				
				const updateParts: string[] = [];
				if (needsInstitUpdate) updateParts.push('institution');
				if (needsHomeUpdate) updateParts.push('homepage');
				console.log(`✓ Updated ${updateParts.join(' and ')}: ${row.prenom} ${row.nom} (ID: ${existing.id})`);
			} else {
				changes.push({
					type: 'no_change',
					prenom: row.prenom,
					nom: row.nom,
					oldInstit: existing.instit,
					newInstit: row.instit,
					home: existing.home,
					id: existing.id
				});
				noChangeCount++;
			}
		} else {
			// Author doesn't exist - insert new record
			const newAuthor = await prisma.e_auteurs.create({
				data: {
					prenom: row.prenom,
					nom: row.nom,
					instit: row.instit,
					home: row.home,
					photo: '',
					email: ''
				}
			});

			changes.push({
				type: 'insert',
				prenom: row.prenom,
				nom: row.nom,
				newInstit: row.instit,
				home: row.home,
				id: newAuthor.id
			});
			insertCount++;
			console.log(`+ Inserted: ${row.prenom} ${row.nom} (ID: ${newAuthor.id})`);
		}
	}

	// Display summary
	console.log('\n' + '='.repeat(80));
	console.log('SUMMARY OF CHANGES');
	console.log('='.repeat(80));
	console.log(`Total authors processed: ${csvRows.length}`);
	console.log(`  - Inserted: ${insertCount}`);
	console.log(`  - Updated: ${updateCount}`);
	console.log(`  - No changes: ${noChangeCount}`);
	console.log('\n');

	// Display detailed changes
	if (insertCount > 0) {
		console.log('INSERTED AUTHORS:');
		console.log('-'.repeat(80));
		changes
			.filter((c) => c.type === 'insert')
			.forEach((c) => {
				console.log(`ID: ${c.id}`);
				console.log(`  Name: ${c.prenom} ${c.nom}`);
				console.log(`  Institution: ${c.newInstit}`);
				console.log(`  Homepage: ${c.home || '(empty)'}`);
				console.log('');
			});
	}

	if (updateCount > 0) {
		console.log('UPDATED AUTHORS:');
		console.log('-'.repeat(80));
		changes
			.filter((c) => c.type === 'update')
			.forEach((c) => {
				console.log(`ID: ${c.id}`);
				console.log(`  Name: ${c.prenom} ${c.nom}`);
				if (c.oldInstit !== c.newInstit) {
					console.log(`  Institution: "${c.oldInstit}" → "${c.newInstit}"`);
				}
				if (c.oldHome !== c.home) {
					if (c.oldHome && c.home) {
						console.log(`  Homepage: "${c.oldHome}" → "${c.home}"`);
					} else if (c.home) {
						console.log(`  Homepage: (empty) → "${c.home}"`);
					} else {
						console.log(`  Homepage: "${c.oldHome}" → (empty)`);
					}
				}
				console.log('');
			});
	}

	if (noChangeCount > 0) {
		console.log(`AUTHORS WITH NO CHANGES: ${noChangeCount}`);
		console.log('-'.repeat(80));
		changes
			.filter((c) => c.type === 'no_change')
			.forEach((c) => {
				console.log(`  ${c.prenom} ${c.nom} (ID: ${c.id})`);
			});
	}

	console.log('\n✅ Processing complete!');
}

// Main execution
const csvPath = process.argv[2] || '/Users/brunochavesferreira/_TEMPO/___/ioea_2026_prenoms_noms_affiliations_homepages.csv';

processAuthors(csvPath)
	.catch((error) => {
		console.error('❌ Error processing authors:', error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
