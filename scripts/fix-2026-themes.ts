import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// First, fix the dates for 2026 themes (Monday to Friday)
async function fixThemeDates() {
	console.log('Fixing 2026 theme dates...\n');

	// Monday - May 11
	await prisma.$executeRaw`UPDATE e_themes SET date_new = '2026-05-11' WHERE id IN (216, 217)`;
	// Tuesday - May 12
	await prisma.$executeRaw`UPDATE e_themes SET date_new = '2026-05-12' WHERE id IN (218, 219)`;
	// Wednesday - May 13
	await prisma.$executeRaw`UPDATE e_themes SET date_new = '2026-05-13' WHERE id IN (220, 221)`;
	// Thursday - May 14
	await prisma.$executeRaw`UPDATE e_themes SET date_new = '2026-05-14' WHERE id IN (222, 223)`;
	// Friday - May 15
	await prisma.$executeRaw`UPDATE e_themes SET date_new = '2026-05-15' WHERE id IN (224, 225)`;

	console.log('✅ Theme dates updated to May 11-15, 2026\n');
}

// Mapping of authors to their correct 2026 theme IDs based on the program
const authorThemeMapping: Record<string, { themeId: number; day: string }> = {
	// Monday - Political Economy
	'Ruben Enikopolov': { themeId: 216, day: 'Monday - Political Economy (lectures)' },
	'Hillel Rapoport': { themeId: 216, day: 'Monday - Political Economy (lectures)' },
	'Aseem Kaul': { themeId: 217, day: 'Monday - Political Economy (workshops)' },
	'Zoe Greene': { themeId: 217, day: 'Monday - Political Economy (workshops)' },

	// Tuesday - Climate & Energy
	'Anant Sudarshan': { themeId: 218, day: 'Tuesday - Climate & Energy (lectures)' },
	'Subhenrendu Pattanayak': { themeId: 218, day: 'Tuesday - Climate & Energy (lectures)' },
	'Laure Athias': { themeId: 219, day: 'Tuesday - Climate & Energy (workshops)' },
	'Pooyan Khashabi': { themeId: 219, day: 'Tuesday - Climate & Energy (workshops)' },

	// Wednesday - Organizational Economics
	'Maitreesh Ghatak': { themeId: 220, day: 'Wednesday - Organizational Economics (lectures)' },
	'Christopher Stanton': { themeId: 220, day: 'Wednesday - Organizational Economics (lectures)' },
	'Petros Sekeris': { themeId: 221, day: 'Wednesday - Organizational Economics (workshops)' },
	'Ayse Gizem Yasar': {
		themeId: 221,
		day: 'Wednesday - Organizational Economics (workshops)'
	},

	// Thursday - Organization and Strategy
	'Tobias Kretschmer': {
		themeId: 222,
		day: 'Thursday - Organization and Strategy (lectures)'
	},
	'Minyuan Zhao': { themeId: 222, day: 'Thursday - Organization and Strategy (lectures)' },
	'Anna Grosman': { themeId: 223, day: 'Thursday - Organization and Strategy (workshops)' },
	'Kun He': { themeId: 223, day: 'Thursday - Organization and Strategy (workshops)' },

	// Friday - Competition Policy
	'Maciej Bernatt': { themeId: 224, day: 'Friday - Competition Policy (lectures)' },
	'Marc Ivaldi': { themeId: 224, day: 'Friday - Competition Policy (lectures)' },
	'Ayush Gupta': { themeId: 225, day: 'Friday - Competition Policy (workshops)' },
	'Roberta Ziparo': { themeId: 225, day: 'Friday - Competition Policy (workshops)' }
};

async function fixPresentationThemes() {
	console.log('Updating presentation theme assignments...\n');

	const authors = await prisma.e_auteurs.findMany();

	let updated = 0;
	let notFound = 0;

	for (const [authorName, mapping] of Object.entries(authorThemeMapping)) {
		// Find author
		const author = authors.find((a) => {
			const fullName = `${a.prenom} ${a.nom}`;
			return fullName === authorName;
		});

		if (!author) {
			console.log(`❌ Author not found: ${authorName}`);
			notFound++;
			continue;
		}

		// Find presentation for this author
		const presentation = await prisma.e_presentation.findFirst({
			where: { id_auteur: author.id }
		});

		if (!presentation) {
			console.log(`❌ No presentation found for: ${authorName}`);
			notFound++;
			continue;
		}

		// Update the theme
		await prisma.e_presentation.update({
			where: { id: presentation.id },
			data: { id_themes: mapping.themeId }
		});

		console.log(`✅ ${authorName} → ${mapping.day}`);
		updated++;
	}

	console.log(`\n✅ Updated ${updated} presentations`);
	if (notFound > 0) {
		console.log(`⚠️  ${notFound} presentations could not be updated`);
	}
}

async function main() {
	await fixThemeDates();
	await fixPresentationThemes();
}

main()
	.catch((e) => {
		console.error('Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
