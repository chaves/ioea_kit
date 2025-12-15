export interface Profession {
	profession: string;
	positions: string;
	frequency: string;
}

export interface TopInstitution {
	count: number;
	institutions: string;
}

export interface ParticipationStat {
	participations: number;
	students: number;
	lecturers: number;
	organizers: number;
}

export const professions: Profession[] = [
	{ profession: 'Academics', positions: 'Assistant Professor, Associate Professor, Director of Research, Head of Department, Head of Research, Professor', frequency: '55.0%' },
	{ profession: 'Economist', positions: 'Advisor, Consultant, Economist, Researcher', frequency: '31.9%' },
	{ profession: 'Executive', positions: 'Associate, Chairman, Chief Marketing Officer, Country Director, Head Office, Manager, Managing Director, Partner, Product Development Manager, Project Manager, Senior Director', frequency: '9.0%' },
	{ profession: 'Other', positions: 'Accountant, Analyst, Cost Analyst, Journalist, Lawyer, Risk Analyst, Statistician', frequency: '4.1%' }
];

export const topInstitutions: TopInstitution[] = [
	{ count: 15, institutions: 'Higher School of Economics, Institut National de Recherche Agronomique (INRA)' },
	{ count: 14, institutions: 'University of Paris 1 Panthéon Sorbonne' },
	{ count: 9, institutions: 'University of Warsaw' },
	{ count: 8, institutions: 'University of Hamburg, University of Paris 10' },
	{ count: 6, institutions: 'Centre National de la Recherche Scientifique (CNRS), Max Planck Institute' },
	{ count: 5, institutions: 'George Mason University, University of São Paulo' },
	{ count: 4, institutions: 'London School of Economics, Technical University of Berlin, University of Fribourg, University of Namur, University of Paris 2' },
	{ count: 3, institutions: 'Copenhagen Business School, Erasmus University Rotterdam, Humboldt University of Berlin, King\'s College London, Lee Kuan Yew School of Public Policy, Tallinn University of Technology, Tilburg University, University of Grenoble 2, University of Helsinki, University of Illinois, University of Luxembourg, Yildiz Technical University' }
];

export const participationStats: ParticipationStat[] = [
	{ participations: 1, students: 544, lecturers: 103, organizers: 79 },
	{ participations: 2, students: 60, lecturers: 11, organizers: 20 },
	{ participations: 3, students: 13, lecturers: 1, organizers: 3 }
];

export const returnedAsOrganizers: string[] = [
	'Veneta Andonova', 'Gonzalo Caballero', 'Tommasco Ciarli', 'Mikhail Drugov',
	'Ruben Enikolopov', 'Marco Faravelli', 'Roberto Galbiati', 'Paul Jensen',
	'Mark Koyama', 'Antoine Loeper', 'Anne Neumann', 'Claude Parthenay',
	'Yannick Perez', 'Matteo Rizzolli', 'Maria Alessandra Rossi', 'Petros Sekeris',
	'Michael Vlassopoulos', 'Giorgio Zanarone'
];

