import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Presentations from IOEA 2026 Program
const presentations = [
	// Monday - Political Economy
	{
		authorName: 'Ruben Enikopolov',
		title: 'Political Effects of Social Media',
		themeType: 'lectures'
	},
	{
		authorName: 'Hillel Rapoport',
		title: 'Migrants as vectors of institutional and cultural change',
		themeType: 'lectures'
	},
	{
		authorName: 'Aseem Kaul',
		title: 'Competition and cooperation between different organizational forms',
		themeType: 'workshops'
	},
	{
		authorName: 'Zoe Greene',
		title: 'Parliament',
		themeType: 'workshops'
	},
	// Tuesday - Climate & Energy
	{
		authorName: 'Anant Sudarshan',
		title: '',
		themeType: 'lectures'
	},
	{
		authorName: 'Subhenrendu Pattanayak',
		title: '',
		themeType: 'lectures'
	},
	{
		authorName: 'Laure Athias',
		title: 'How do institutions emerge?',
		themeType: 'workshops'
	},
	{
		authorName: 'Pooyan Khashabi',
		title: 'Digital work and Organization design',
		themeType: 'workshops'
	},
	// Wednesday - Organizational Economics
	{
		authorName: 'Maitreesh Ghatak',
		title: 'Incentives and Organization Design with Motivated Agents',
		themeType: 'lectures'
	},
	{
		authorName: 'Christopher Stanton',
		title: 'Understanding People, Practices, and Productivity through Personnel Economics',
		themeType: 'lectures'
	},
	{
		authorName: 'Petros Sekeris',
		title: 'Economic Development, Institutions and Democracy',
		themeType: 'workshops'
	},
	{
		authorName: 'Ayse Gizem Yasar',
		title: 'Understanding economic dependencies in AI markets: research design and regulatory implications',
		themeType: 'workshops'
	},
	// Thursday - Organization and Strategy
	{
		authorName: 'Tobias Kretschmer',
		title: 'Platforms and Complementors',
		themeType: 'lectures'
	},
	{
		authorName: 'Minyuan Zhao',
		title: 'Institutional Heterogeneity and Firm Strategy',
		themeType: 'lectures'
	},
	{
		authorName: 'Anna Grosman',
		title: 'Ownership, Control and Corporate Governance: Evidence and Implications',
		themeType: 'workshops'
	},
	{
		authorName: 'Kun He',
		title: 'Multimodality, manipulation, and malintent: A "Three-M" framework for multimodal disinformation',
		themeType: 'workshops'
	},
	// Friday - Competition Policy
	{
		authorName: 'Maciej Bernatt',
		title: 'The Pro-Democratic Role of Competition Law: From Diagnosis to the Analysis of Political Risks',
		themeType: 'lectures'
	},
	{
		authorName: 'Marc Ivaldi',
		title: 'Mergers and Innovation',
		themeType: 'lectures'
	},
	{
		authorName: 'Ayush Gupta',
		title: 'Opt In? Opt Out?',
		themeType: 'workshops'
	},
	{
		authorName: 'Roberta Ziparo',
		title: 'Cooperation and information in the household',
		themeType: 'workshops'
	}
];

async function updatePresentations() {
	console.log('Starting to update presentations...\n');

	// First, fetch all authors
	const authors = await prisma.e_auteurs.findMany();
	console.log(`Found ${authors.length} authors in database`);

	// Fetch all themes
	const themes = await prisma.e_themes.findMany();
	console.log(`Found ${themes.length} themes in database\n`);

	// Helper function to find author by name
	const findAuthor = (name: string) => {
		// Try exact match first
		let author = authors.find((a) => {
			const fullName = `${a.prenom} ${a.nom}`.toLowerCase();
			return fullName === name.toLowerCase();
		});

		if (!author) {
			// Try matching last name only
			const lastName = name.split(' ').pop()?.toLowerCase();
			author = authors.find((a) => a.nom.toLowerCase() === lastName);
		}

		return author;
	};

	// Helper function to find theme by type (lectures or workshops)
	const findTheme = (lecwp: string) => {
		return themes.find((t) => t.lecwp === lecwp);
	};

	let updated = 0;
	let notFound = 0;

	for (const pres of presentations) {
		const author = findAuthor(pres.authorName);
		const theme = findTheme(pres.themeType);

		if (!author) {
			console.log(`❌ Author not found: ${pres.authorName}`);
			notFound++;
			continue;
		}

		if (!theme) {
			console.log(`❌ Theme not found: ${pres.themeType}`);
			notFound++;
			continue;
		}

		// Check if presentation already exists for this author
		const existing = await prisma.e_presentation.findFirst({
			where: { id_auteur: author.id }
		});

		if (existing) {
			// Update existing presentation
			await prisma.e_presentation.update({
				where: { id: existing.id },
				data: {
					titre: pres.title,
					id_themes: theme.id
				}
			});
			console.log(`✅ Updated: ${pres.authorName} - "${pres.title}"`);
		} else {
			// Create new presentation
			await prisma.e_presentation.create({
				data: {
					id_auteur: author.id,
					titre: pres.title,
					resume: '',
					lien: '',
					id_themes: theme.id,
					rang: 1
				}
			});
			console.log(`✅ Created: ${pres.authorName} - "${pres.title}"`);
		}

		updated++;
	}

	console.log(`\n✅ Successfully processed ${updated} presentations`);
	if (notFound > 0) {
		console.log(`⚠️  ${notFound} presentations could not be processed (authors/themes not found)`);
	}
}

updatePresentations()
	.catch((e) => {
		console.error('Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
