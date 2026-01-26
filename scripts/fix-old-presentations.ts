import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOldPresentations() {
	console.log('Fixing incorrectly updated old presentations...\n');

	// Restore old presentations to their original theme (14 - Research Questions from 2002)
	console.log('Restoring old presentations to theme 14 (Research Questions 2002):');

	await prisma.e_presentation.update({
		where: { id: 228 },
		data: { id_themes: 14 }
	});
	console.log('✅ Restored presentation #228 (Petros Sekeris - old) to theme 14');

	await prisma.e_presentation.update({
		where: { id: 361 },
		data: { id_themes: 14 }
	});
	console.log('✅ Restored presentation #361 (Aseem Kaul - old) to theme 14\n');

	// Create new 2026 presentations for these authors
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
			id_themes: 221, // Wednesday workshops
			rang: 1
		}
	});
	console.log(
		'✅ Created new presentation for Petros Sekeris (Wednesday - Organizational Economics workshops)'
	);

	// Create Aseem Kaul 2026 presentation (Monday - Political Economy workshops, theme 217)
	await prisma.e_presentation.create({
		data: {
			id_auteur: aseem.id,
			titre: 'Competition and cooperation between different organizational forms',
			resume: '',
			lien: '',
			id_themes: 217, // Monday workshops
			rang: 1
		}
	});
	console.log(
		'✅ Created new presentation for Aseem Kaul (Monday - Political Economy workshops)'
	);

	console.log('\n✅ All fixes completed');
}

fixOldPresentations()
	.catch((e) => {
		console.error('Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
