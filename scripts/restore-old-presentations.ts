import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function restoreAndCreatePresentations() {
	console.log('Restoring old presentations and creating new 2026 ones...\n');

	// Restore Petros Sekeris presentation #228 to 2012 (theme 102 - workshops from 2012)
	console.log('Restoring old presentations to their original years:');
	await prisma.e_presentation.update({
		where: { id: 228 },
		data: { id_themes: 102 } // 2012 workshops theme (same as nearby presentation #227)
	});
	console.log('✅ Restored presentation #228 (Petros Sekeris) to theme 102 (2012 workshops)');

	// Restore Aseem Kaul presentation #361 to 2020 (theme 171 - workshops from 2020)
	await prisma.e_presentation.update({
		where: { id: 361 },
		data: { id_themes: 171 } // 2020 workshops theme (same as nearby presentation #360)
	});
	console.log('✅ Restored presentation #361 (Aseem Kaul) to theme 171 (2020 workshops)\n');

	// Now create NEW 2026 presentations for these authors
	console.log('Creating new 2026 presentations:');

	// Get author IDs
	const petros = await prisma.e_auteurs.findFirst({
		where: {
			nom: 'Sekeris',
			prenom: 'Petros'
		}
	});

	const aseem = await prisma.e_auteurs.findFirst({
		where: {
			nom: 'Kaul',
			prenom: 'Aseem'
		}
	});

	if (!petros || !aseem) {
		console.error('❌ Authors not found');
		return;
	}

	// Create Petros Sekeris 2026 presentation (Wednesday - Organizational Economics workshops, theme 221)
	await prisma.e_presentation.create({
		data: {
			id_auteur: petros.id,
			titre: 'Economic Development, Institutions and Democracy',
			resume: '',
			lien: '',
			id_themes: 221, // Wednesday workshops - Organizational Economics
			rang: 1
		}
	});
	console.log(
		'✅ Created new presentation for Petros Sekeris (2026 - Wednesday, Organizational Economics workshops)'
	);

	// Create Aseem Kaul 2026 presentation (Monday - Political Economy workshops, theme 217)
	await prisma.e_presentation.create({
		data: {
			id_auteur: aseem.id,
			titre: 'Competition and cooperation between different organizational forms',
			resume: '',
			lien: '',
			id_themes: 217, // Monday workshops - Political Economy
			rang: 1
		}
	});
	console.log(
		'✅ Created new presentation for Aseem Kaul (2026 - Monday, Political Economy workshops)'
	);

	console.log('\n✅ All fixes completed successfully');
}

restoreAndCreatePresentations()
	.catch((e) => {
		console.error('Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
