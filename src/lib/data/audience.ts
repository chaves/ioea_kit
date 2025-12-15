export interface AudienceByRegion {
	region: string;
	countries: string;
	participants: number;
	frequency: string;
}

export const audienceByRegion: AudienceByRegion[] = [
	{ region: 'Africa', countries: 'South Africa, Cameroon, Ethiopia, Nigeria, Malawi, Togo, Tunisia, Zimbabwe, Kenya', participants: 26, frequency: '2.29%' },
	{ region: 'North America', countries: 'Canada, United States', participants: 123, frequency: '10.84%' },
	{ region: 'South America', countries: 'Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guatemala, Jamaica, Mexico, Peru, Uruguay, Venezuela', participants: 76, frequency: '6.7%' },
	{ region: 'Asia and the Middle East', countries: 'Azerbaijan, Bangladesh, China, Hong Kong, India, Indonesia, Israel, Japan, Kazakhstan, Kyrgyzstan, Lebanon, Malaysia, Pakistan, Philippines, South Korea, Thailand, Tajikistan, Uzbekistan, Vietnam', participants: 122, frequency: '10.75%' },
	{ region: 'Oceania', countries: 'Australia', participants: 5, frequency: '0.44%' },
	{ region: 'Europe (EU-28)', countries: 'Austria, Belgium, Bulgaria, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Italy, Netherlands, Portugal, Poland, Romania, Slovakia, Slovenia, Spain, Sweden, England', participants: 665, frequency: '58.59%' },
	{ region: 'Europe (non-EU)', countries: 'Bosnia, Norway, Russia, Turkey, Ukraine, Armenia, Switzerland, Montenegro, Slovenia', participants: 118, frequency: '10.4%' }
];

