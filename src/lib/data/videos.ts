export interface Video {
  id: string;
  name: string;
  institution: string;
  topic?: string;
}

export interface VideoSection {
  year: number;
  title: string;
  videos: Video[];
}

export const videoSections: VideoSection[] = [
  {
    year: 2025,
    title: "IOEA 2025: Faculties speak about it!",
    videos: [
      {
        id: "PjA56VrCc_w",
        name: "Ricardo Dahis",
        institution: "Monash University",
      },
      {
        id: "w2Q8SNeAGzg",
        name: "Alan Benson",
        institution: "University of Minnesota",
      },
      {
        id: "1etlwey5sds",
        name: "Cary Coglianese",
        institution: "Penn Carey Law",
      },
      {
        id: "vt8gCCLa7A0",
        name: "Joseph Emmens",
        institution: "Barcelona School of Economics",
      },
      {
        id: "5YdQY9iw5DA",
        name: "Giorgio Zanarone",
        institution: "University of Lausanne",
      },
      {
        id: "Nn4vACJ3izk",
        name: "Benjamin Marx",
        institution: "Boston University",
      },
      {
        id: "BH1GojY0vZQ",
        name: "Elisabeth S. Clemens",
        institution: "University of Chicago",
      },
      {
        id: "PDyu6HmUHK4",
        name: "Simon Porcher",
        institution: "Paris Dauphine-PSL University",
      },
      {
        id: "xbAEcBmzc_E",
        name: "Jens Prüfer",
        institution: "Tilburg University & University of East Anglia",
      },
    ],
  },
  {
    year: 2024,
    title: "IOEA 2024: Faculties speak about it!",
    videos: [
      {
        id: "TrM9edtAKfk",
        name: "Guido Friebel",
        institution: "Goethe U., Frankfurt",
      },
      {
        id: "0gKKAuk1mXA",
        name: "Christophe Benavent",
        institution: "U. Paris-Dauphine",
      },
      { id: "pVRE-8FKFUo", name: "Muxin Li", institution: "Bocconi U." },
      {
        id: "LeFJyQ9kouA",
        name: "Howard Shelanski",
        institution: "Georgetown U.",
      },
      {
        id: "cFCZY7nfPbs",
        name: "Christopher Decker",
        institution: "U. of Oxford",
      },
      {
        id: "az2Y9WIT9bc",
        name: "Jeffery A. Jenkins",
        institution: "U. Southern California",
      },
      {
        id: "WcSDuzX9bDo",
        name: "Federica Carugati",
        institution: "King's College London",
      },
      {
        id: "D10uPBRiPPA",
        name: "Torbjörn Becker",
        institution: "Stockholm School of Economics",
      },
      {
        id: "exHJ5-jcYFQ",
        name: "Julia Shvets",
        institution: "U. of Cambridge",
      },
      {
        id: "RH8B1aitnDs",
        name: "Claudine Gartenberg",
        institution: "U. of Pennsylvania, Wharton",
      },
      {
        id: "9ogAoIS6LrY",
        name: "Daniel Herrera",
        institution: "Paris Dauphine - PSL",
      },
      { id: "JBUsxWRdgmQ", name: "Rok Spruk", institution: "Ljubljana U." },
      {
        id: "o-tubwVk0KE",
        name: "Nadia Von Jacobi",
        institution: "U. of Trento",
      },
    ],
  },
  {
    year: 2024,
    title: "IOEA 2024: participants' impressions",
    videos: [
      { id: "c1zzIZRZiho", name: "Participants", institution: "IOEA 2024" },
    ],
  },
  {
    year: 2023,
    title: "IOEA 2023: Faculties speak about it!",
    videos: [
      {
        id: "CzrsQ1bKkhE",
        name: "William E. Kovacic",
        institution: "George Washington University",
      },
      {
        id: "olsSRndmONs",
        name: "Gillian Hadfield",
        institution: "University of Toronto",
      },
      {
        id: "mHbMm9xZkpc",
        name: "Edward J. Balleisen",
        institution: "Duke University",
      },
      {
        id: "NxEX_iBfEK4",
        name: "Lisa Bernstein",
        institution: "University of Chicago",
      },
      {
        id: "pszQcw683w0",
        name: "Ron Boschma",
        institution: "Utrecht University",
      },
      {
        id: "ZSQVAt8MO2c",
        name: "Tore Ellingsen",
        institution: "Stockholm School of Economics",
      },
      {
        id: "atYGasBtSRM",
        name: "Sonia Bhalotra",
        institution: "University of Warwick",
      },
      {
        id: "SdtOIaSCGXk",
        name: "Carlos Pereira",
        institution: "Getulio Vargas Foundation",
      },
      {
        id: "VIXrCIyGBc8",
        name: "Christian Zehnder",
        institution: "University of Lausanne",
      },
      {
        id: "sxwuz5x7AQQ",
        name: "Francisco Brahm",
        institution: "London Business School",
      },
      {
        id: "V9FOM7FKgJY",
        name: "Saad Gulzar",
        institution: "Princeton University",
      },
      {
        id: "nXpy6ZPdeWQ",
        name: "Camilo Garcia-Jimeno",
        institution: "Federal Reserve Bank of Chicago",
      },
      {
        id: "6-2ZPVRmAWs",
        name: "Germain Gauthier",
        institution: "ETH Zürich",
      },
    ],
  },
  {
    year: 2023,
    title: "IOEA 2023: participants' impression",
    videos: [
      {
        id: "xNmJvGXucH4",
        name: "Matylda Trocinska",
        institution: "LMU Munich",
      },
      {
        id: "q7RxTO7uiMk",
        name: "Alexander Rodivilov",
        institution: "Stevens Institute of Technology",
      },
      {
        id: "UKLFYTYTf8A",
        name: "Juni Singh",
        institution: "California Institute of Technology",
      },
      {
        id: "Em6L81iBV-w",
        name: "Manuel Grieder",
        institution: "UniDistance Suisse",
      },
      {
        id: "2YU-HgBb0aA",
        name: "Reem Ismail",
        institution: "Paris Dauphine - PSL University",
      },
      {
        id: "bLRSEheE-0I",
        name: "Joanna Williams",
        institution: "University of California",
      },
    ],
  },
  {
    year: 2022,
    title: "IOEA 2022: Faculties speak about it!",
    videos: [
      {
        id: "01R5DT2M_UI",
        name: "Bernard Salanié",
        institution: "University of Columbia",
      },
      {
        id: "VxwFJ48F0Jo",
        name: "Dilip Mookherjee",
        institution: "Boston University",
      },
      {
        id: "a3P5aG-zG60",
        name: "Dominic Rohner",
        institution: "Lausanne University",
      },
      {
        id: "oedzK11MZ0Q",
        name: "Erina Ytsma",
        institution: "Carnegie Mellon University",
      },
      { id: "jyN6isWiZvo", name: "Steve Tadelis", institution: "UC Berkeley" },
      {
        id: "QVLx6VOM3_4",
        name: "Marc Bourreau",
        institution: "Télécom Paris, IPP",
      },
      {
        id: "5m_pzRvJzfU",
        name: "Margarethe Wiersema",
        institution: "Irvine University",
      },
    ],
  },
  {
    year: 2022,
    title: "IOEA 2022: participants' impression",
    videos: [
      { id: "YJpQ80-TktA", name: "Chloé Nibourel", institution: "" },
      { id: "r5wdP_LYKkQ", name: "Gabriele Pinto", institution: "" },
      { id: "vDHP7sc2-ZM", name: "Oliver Feltham", institution: "" },
      { id: "n_-g6AwNeB4", name: "Reem Ismael", institution: "" },
      { id: "0Tdyk76PpvQ", name: "Yuanchen Su", institution: "" },
    ],
  },
  {
    year: 2019,
    title: "IOEA 2019: faculties speak about it!",
    videos: [
      { id: "4Dfwg_nk-sE", name: "Faculty Panel", institution: "IOEA 2019" },
    ],
  },
  {
    year: 2019,
    title: "IOEA 2019: a quick overview of some shared researches",
    videos: [
      {
        id: "BjE4EDB713I",
        name: "Francine Lafontaine",
        institution: "University of Michigan, USA",
        topic:
          "Where to from Here? Industrial Organization, Organizational Economics, and Public Policy",
      },
      {
        id: "BwqPaTTNAVI",
        name: "Eric Maskin",
        institution: "Nobel prize in economics, Harvard U., USA",
        topic: "How to Improve Presidential Elections",
      },
    ],
  },
];

/**
 * Get random video testimonials for homepage
 * @param count Number of videos to return
 * @returns Array of random video testimonials
 */
export function getRandomVideoTestimonials(count: number, recentYears: number = 0): Video[] {
  // Get all faculty videos (not participants)
  let sections = videoSections.filter(
    (section) =>
      section.title.includes("Faculties speak") ||
      section.title.includes("faculties speak")
  );

  // Limit to the most recent N years if specified
  if (recentYears > 0) {
    const years = [...new Set(sections.map((s) => s.year))].sort((a, b) => b - a);
    const cutoffYears = years.slice(0, recentYears);
    sections = sections.filter((s) => cutoffYears.includes(s.year));
  }

  const facultyVideos = sections.flatMap((section) => section.videos);
  const shuffled = [...facultyVideos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
