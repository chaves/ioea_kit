export interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

export interface SponsorsByYear {
  [key: string]: Sponsor[];
}

export const sponsorsByYear: SponsorsByYear = {
  "2023": [
    {
      name: "Chaire GovReg",
      logo: "/images/sponsors/govreg.png",
      url: "http://chairgovreg.fondation-dauphine.fr/",
    },
    {
      name: "DRM",
      logo: "/images/sponsors/DRM_new.png",
      url: "https://drm.dauphine.fr/",
    },
  ],
  "2022": [
    {
      name: "Chaire GovReg",
      logo: "/images/sponsors/govreg.png",
      url: "http://chairgovreg.fondation-dauphine.fr/",
    },
    {
      name: "DRM",
      logo: "/images/sponsors/DRM_new.png",
      url: "https://drm.dauphine.fr/",
    },
    {
      name: "Isula Corsica",
      logo: "/images/sponsors/Logo_CdC.png",
      url: "https://www.isula.corsica/",
    },
  ],
  "2002-2019": [
    {
      name: "European Commission",
      logo: "/images/sponsors/logo-ec--fr.svg",
      url: "http://ec.europa.eu/",
    },
    {
      name: "Collectivité de Corse",
      logo: "/images/sponsors/corse.png",
      url: "http://www.corse.fr/",
    },
    {
      name: "Ministère de l'Enseignement Supérieur",
      logo: "/images/sponsors/ministere.png",
      url: "http://www.enseignementsup-recherche.gouv.fr/",
    },
    {
      name: "INRA",
      logo: "/images/sponsors/inra-new.png",
      url: "http://www.inra.fr/",
    },
    {
      name: "Île-de-France",
      logo: "/images/sponsors/idf.png",
      url: "http://www.iledefrance.fr/",
    },
    {
      name: "Paris Ouest",
      logo: "/images/sponsors/paris-ouest.jpg",
      url: "http://www.u-paris10.fr/",
    },
    {
      name: "CNRS",
      logo: "/images/sponsors/cnrs.svg",
      url: "http://www.cnrs.fr/",
    },
    {
      name: "DIME",
      logo: "/images/sponsors/dime.gif",
      url: "http://www.dime-eu.org/",
    },
    {
      name: "Google",
      logo: "/images/sponsors/google.jpg",
      url: "http://www.google.com/",
    },
    {
      name: "EDEOS",
      logo: "/images/sponsors/Logo-EOS-2.png",
      url: "http://www.u-paris10.fr/edeos",
    },
    { name: "COE", logo: "/images/sponsors/coe.jpg", url: "" },
  ],
};

/**
 * Get footer sponsors (current year sponsors)
 */
export function getFooterSponsors(): Sponsor[] {
  return sponsorsByYear["2023"] || [];
}
