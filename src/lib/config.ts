// IOEA Configuration - migrated from config_perso.php

/**
 * Main configuration object
 */
export const config = {
  // Basic constants
  currentYear: 2026,
  archiveFromYear: 2002,
  archiveToYear: 2025,
  sessionNumber: 23, // Current session number (2026 = 23rd session)

  // Bad sessions (cancelled years)
  badSessions: [2013, 2020, 2021] as number[],
  badPhotos: [2020, 2021] as number[],

  // Session dates
  session: {
    year: 2026,
    sessionNumber: 23,
    startDate: 6,
    endDate: 10,
    month: "April",
    dateRange: "6-10 April",
    fullDateRange: "6-10 April 2026",
  },

  // Emails
  emails: {
    general: "ioea.coordinator@gmail.com",
    coordination: "ioea.coordinator@gmail.com",
    webmaster: "webmaster@ioea.eu",
  },

  // Deadlines
  deadlines: {
    application: "March 15th",
    notification: "by March 15th",
    registration: "March 27th",
    students: "March 27th",
  },
  // Status options for call applications
  statusOptions: {
    1: "Ph.D. student",
    2: "Post-doc",
    3: "Academic",
    4: "Other",
  } as Record<number, string>,
  // Call steps
  callSteps: {
    1: "Information about you",
    2: "Affiliation and project",
    3: "Upload your files",
  } as Record<number, string>,
  // Travel options
  travel: {
    transport: ["", "Plane", "Boat"],
    locations: {
      1: "Ajaccio",
      2: "Bastia",
      3: "Calvi",
      4: "Ile Rousse",
      5: "Propriano",
    } as Record<number, string>,
  },
  // Transfer options
  transfer: {
    arrival: {
      1: "Collective bus (from Ajaccio airport)",
      2: "Car rental",
      3: "Public bus",
      4: "Taxi",
      5: "Personal car",
      6: "Unknown",
    } as Record<number, string>,
    departure: {
      1: "Collective bus (to Ajaccio airport)",
      2: "Car rental",
      3: "Public bus",
      4: "Taxi",
      5: "Personal car",
      6: "Unknown",
    } as Record<number, string>,
  },
  // Students group open
  studentsGroupOpen: false,
  // Call for applications status - controls whether applications are open
  callIsOpen: true,
  // Brochure configuration
  brochure: {
    // PDF source (optional - if provided, image will be generated from this)
    pdfName: "IOEABrochure2024.pdf",
    name: "IOEABrochure2024.pdf",
    // Image filename (generated from PDF or manually created)
    imageName: "graphiques/IOEABrochure2024.jpg",
  },
  // Program configuration
  program: {
    // PDF source (optional - if provided, image will be generated from this)
    pdfName: `IOEAProgramme2026.pdf`,
    // Image filename (generated from PDF or manually created)
    imageName: `graphiques/IOEAProgramme2026.jpg`,
  },
  // Financial information (prices in euros)
  prices: {
    travel: {
      flightMin: 200,
      flightMax: 400,
      busTransfer: 60,
    },
    accommodation: {
      roomPerWeek: 340,
      hotelPerNight: 80,
    },
    meals: {
      weeklyRate: 200,
    },
    registration: {
      fee: 600,
    },
  },
} as const;

// Export for backward compatibility
export const staticConfig = {
  currentYear: config.currentYear,
  archiveFromYear: config.archiveFromYear,
  archiveToYear: config.archiveToYear,
  sessionNumber: config.sessionNumber,
  badSessions: config.badSessions,
  badPhotos: config.badPhotos,
} as const;

// Backward compatibility function
export function getConfig() {
  return config;
}

// Menu configuration
export const menus = {
  main: [
    { href: "/", label: "Home", title: "Home" },
    { href: "/2026", label: "IOEA 2026", title: "IOEA 2026" },
    { href: "/project", label: "The project", title: "The project" },
    { href: "/community", label: "The community", title: "The community" },
    { href: "/archives", label: "Past editions", title: "Past editions" },
    { href: "/videos", label: "Videos", title: "Videos" },
    { href: "/sponsors", label: "Sponsors", title: "Sponsors" },
  ],
  ioea2026: [
    {
      href: "/2026",
      label: "Call for papers",
      title: "Call for papers - IOEA 2026",
    },
    {
      href: "/2026/lectures",
      label: "Lectures",
      title: "Lectures - IOEA 2026",
    },
    {
      href: "/2026/workshops",
      label: "Workshops",
      title: "Workshops - IOEA 2026",
    },
    {
      href: "/2026/seminars",
      label: "Seminars",
      title: "Seminars - IOEA 2026",
    },
    {
      href: "/2026/lunch-sessions",
      label: "Lunch Sessions",
      title: "Lunch Sessions - IOEA 2026",
    },
    {
      href: "/2026/students",
      label: "Participants",
      title: "Participants - IOEA 2026",
    },
    { href: "/2026/meetings", label: "Meetings", title: "Meetings" },
    {
      href: "/2026/informations",
      label: "Practical Info",
      title: "Practical Informations - IOEA 2026",
    },
  ],
  project: [
    {
      href: "/project",
      label: "Goals of the IOEA",
      title: "Goals of the IOEA",
    },
    {
      href: "/project/research",
      label: "Research areas",
      title: "Research areas",
    },
    {
      href: "/project/organization",
      label: "Organization",
      title: "Organization",
    },
  ],
  community: [
    { href: "/community", label: "The Community", title: "The Community" },
    {
      href: "/community/testimonials",
      label: "Testimonials",
      title: "Testimonials",
    },
    { href: "/community/faculty", label: "The Faculty", title: "The Faculty" },
    {
      href: "/community/organizers",
      label: "The Organizers",
      title: "The Organizers",
    },
    {
      href: "/community/audience",
      label: "The Audience",
      title: "The Audience",
    },
    { href: "/community/alumni", label: "Alumni", title: "Alumni" },
    {
      href: "/community/awards",
      label: "Prize winners",
      title: "Prize winners",
    },
    { href: "/community/join", label: "Join", title: "Join the community" },
    { href: "/community/photos", label: "Photos", title: "Photos" },
  ],
} as const;

// Generate archive years
export function getArchiveYears(): number[] {
  const years: number[] = [];
  for (
    let i = config.archiveToYear;
    i >= config.archiveFromYear;
    i--
  ) {
    if (!config.badSessions.includes(i)) {
      years.push(i);
    }
  }
  return years;
}

// Generate photo years
export function getPhotoYears(): number[] {
  const years: number[] = [];
  for (
    let i = config.archiveToYear;
    i >= config.archiveFromYear;
    i--
  ) {
    if (!config.badPhotos.includes(i)) {
      years.push(i);
    }
  }
  return years;
}
