export interface Testimonial {
	name: string;
	photo: string;
	position: string;
	institution: string;
	website: string | null;
	quote: string;
}

export const testimonials: Testimonial[] = [
	{
		name: 'Veneta Andonova',
		photo: '/images/testimonials/ANDONOVA.jpg',
		position: 'Associate Professor',
		institution: 'American University in Bulgaria',
		website: 'https://www.aubg.edu/faculty/veneta-andonova',
		quote: `ESNIE summer school provides an opportunity both for learning and for personal interaction and enrichment. The knowledge, creativity and the drive to share of the senior scholars marked me profoundly and gave me the exposure and constructive feedback to advance in my own research endeavors. The community that has grown around ESNIE has been accompanying me in projects and conferences but they also sang on the first birthday party of my son, an unforgettable moment of kindness that I deeply appreciate. The experience I had during ESNIE blurs the boundaries between professionally relevant and personally satisfying human interaction. I will eagerly recommend the ESNIE Summer school and come back with great pleasure!`
	},
	{
		name: 'Paul Jensen',
		photo: '/images/testimonials/JENSEN.jpg',
		position: 'Professorial Research Fellow, Chair in Public Policy & Engagement',
		institution: 'Melbourne Institute, University of Melbourne',
		website: 'http://www.melbourneinstitute.com/staff/pjensen/',
		quote: `The experiences I have had at ESNIE, as both a student and as a Faculty member, were fantastic. The event itself is held in a wonderful location away from the hustle and bustle of a major city – despite its remote location on Corsica, the organizers go to extraordinary lengths to make the week-long event run smoothly. And it provides the students with a rare opportunity to mix with their peers and some of the world's leading scholars in a relaxed environment. In addition, there are lots of social activities planned over the week, which provides the opportunity to have in-depth discussions with like-minded individuals. The friendships forged at this event last a long time. I couldn't recommend it highly enough.`
	},
	{
		name: 'Mark Koyama',
		photo: '/images/testimonials/KOYAMA.jpg',
		position: 'Assistant Professor',
		institution: 'George Mason University',
		website: 'http://economics.gmu.edu/people/mkoyama2',
		quote: `I attended ESNIE in May 2010 and had a great experience. I benefited from hearing lectures from Oliver Hart and Maristella Botticini among others and from workshops run by postdocs, notably Suresh Naidu. During the afternoons, I enjoyed listening to and discussing the other student papers while the evenings were spent enjoying good food and wine in the company of other students as well as the faculty. The feedback was extremely useful and I was fortunate enough to win the prize for best paper. In the subsequent five years I've benefited enormously from the friends and connections I made at ESNIE and I enjoyed returning to Corsica in 2015 as a member of the faculty.`
	},
	{
		name: 'Maria Alessandra Rossi',
		photo: '/images/testimonials/ROSSI.jpg',
		position: 'Assistant Professor',
		institution: 'University of Siena',
		website: 'http://www.econ-pol.unisi.it/rossi/',
		quote: `I came across the ESNIE website rather accidentally in 2003. I was in the second year of my Ph.D., lucky enough to be already passionate about new institutional and organizational economics. ESNIE turned out to be a truly mind-opening experience. It allowed me not only to be exposed to brilliant thinkers and the most advanced ideas in the field, but also to be faced with a method of scientific exchange that dynamically incorporates new insights from any participant, young or senior. Needless to say, from ESNIE stemmed long-standing friendships and chances of professional collaboration.`
	},
	{
		name: 'Petros Sekeris',
		photo: '/images/testimonials/SEKERIS.jpg',
		position: 'Principal Lecturer',
		institution: 'Portsmouth Business School',
		website: 'http://www.port.ac.uk/economics-and-finance/staff/petros-sekeris.html',
		quote: `The Institutional and Organizational Economics Academy (formerly known as ESNIE) has greatly contributed to my academic career in multiple ways. I attended the event in 2010 as a student, and the year after as a Workshop organizer. On both occasions I had the opportunity to significantly widen my scientific network and to obtain important feedback on my work. As a Post-doctoral student, I presented my work in front of scholars from top schools around the world, and as a consequence my paper was significantly improved.`
	},
	{
		name: 'Giorgio Zanarone',
		photo: '/images/testimonials/ZANARONE.jpg',
		position: 'Associate Professor',
		institution: 'CUNEF',
		website: 'http://campusvirtual.cunef.edu/web/gzanarone/home/',
		quote: `I attended ESNIE twice—as a PHD student, in 2005, and as a junior lecturer, in 2009. Both stints have had an enduring impact on my research and on my professional and personal search. There, I have met coauthors, mentors, and friends. ESNIE is the only venue I know that can grab top scholars, young researchers, and students from all over the world, lock them into a small fun village with no escape, and force them to talk non-stop for five days. I cannot think of a better way to disseminate and enrich institutional and organizational economics.`
	}
];

/**
 * Get a random selection of testimonials
 * @param count Number of testimonials to return
 * @returns Array of random testimonials
 */
export function getRandomTestimonials(count: number): Testimonial[] {
	const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

