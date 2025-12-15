// IOEA Configuration - migrated from config_perso.php

export const config = {
  currentYear: 2025,
  archiveFromYear: 2002,
  archiveToYear: 2025,

  // Bad sessions (cancelled years)
  badSessions: [2013, 2020, 2021] as number[],
  badPhotos: [2020, 2021] as number[],

  // Emails
  emails: {
    general: "ioea.coordinator@gmail.com",
    coordination: "ioea.coordinator@gmail.com",
    webmaster: "webmaster@ioea.eu",
  },

  // Deadlines
  deadlines: {
    application: "March 17th 2025",
    notification: "from March 21st 2025",
    registration: "April 27th 2025",
    students: "April 27th 2025",
  },

  // Application deadlines with status flags
  applicationDeadlines: {
    first: {
      date: "March 31",
      notificationDate: "April 4",
      active: true,
    },
    second: {
      date: "April 14",
      notificationDate: "April 18",
      active: true,
    },
  },
  registrationDeadline: {
    date: "April 27",
    active: true,
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
  studentsGroupOpen: true,

  // Program visibility - show program card in sidebar only when program is done
  programIsDone: false,

  // Call for applications status - controls whether applications are open
  callIsOpen: false,

  // Brochure configuration
  brochure: {
    name: "IOEABrochure2024.pdf",
    imageName: "graphiques/IOEABrochure2024.jpg",
  },

  // Financial information (prices in euros)
  prices: {
    travel: {
      flightMin: 200,
      flightMax: 400,
      busTransfer: 50,
    },
    accommodation: {
      roomPerWeek: 320,
      hotelPerNight: 80,
    },
    meals: {
      weeklyRate: 180,
    },
    registration: {
      fee: 550,
    },
  },
} as const;

// Menu configuration
export const menus = {
  main: [
    { href: "/", label: "Home", title: "Home" },
    { href: "/2025", label: "IOEA 2025", title: "IOEA 2025" },
    { href: "/project", label: "The project", title: "The project" },
    { href: "/community", label: "The community", title: "The community" },
    { href: "/archives", label: "Past editions", title: "Past editions" },
    { href: "/videos", label: "Videos", title: "Videos" },
    { href: "/sponsors", label: "Sponsors", title: "Sponsors" },
  ],
  ioea2025: [
    {
      href: "/2025",
      label: "Call for papers",
      title: "Call for papers - IOEA 2025",
    },
    {
      href: "/2025/lectures",
      label: "Lectures",
      title: "Lectures - IOEA 2025",
    },
    {
      href: "/2025/workshops",
      label: "Workshops",
      title: "Workshops - IOEA 2025",
    },
    {
      href: "/2025/seminars",
      label: "Seminars",
      title: "Seminars - IOEA 2025",
    },
    {
      href: "/2025/lunch-sessions",
      label: "Lunch Sessions",
      title: "Lunch Sessions - IOEA 2025",
    },
    {
      href: "/2025/students",
      label: "Participants",
      title: "Participants - IOEA 2025",
    },
    { href: "/2025/meetings", label: "Meetings", title: "Meetings" },
    {
      href: "/2025/informations",
      label: "Practical Info",
      title: "Practical Informations - IOEA 2025",
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
  for (let i = config.archiveToYear; i >= config.archiveFromYear; i--) {
    if (!config.badSessions.includes(i)) {
      years.push(i);
    }
  }
  return years;
}

// Generate photo years
export function getPhotoYears(): number[] {
  const years: number[] = [];
  for (let i = config.archiveToYear; i >= config.archiveFromYear; i--) {
    if (!config.badPhotos.includes(i)) {
      years.push(i);
    }
  }
  return years;
}
