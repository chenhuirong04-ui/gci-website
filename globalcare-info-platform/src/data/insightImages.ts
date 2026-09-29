// Existing country-specific images used by the Insights market grid and article cards.
export const COUNTRY_GRID_IMG: Record<string, string> = {
  "UAE / Dubai":  "/images/countries/country-uae.jpg",
  "UAE":          "/images/countries/country-uae.jpg",
  "United Arab Emirates": "/images/countries/country-uae.jpg",
  "Saudi Arabia": "/images/countries/country-saudi.jpg",
  "Qatar":        "/images/countries/country-qatar.jpg",
  "Bahrain":      "/images/countries/country-bahrain.jpg",
  "Oman":         "/images/countries/country-oman.jpg",
  "Kuwait":       "/images/countries/country-kuwait.jpg",
  "Kenya":        "/images/countries/country-kenya.jpg",
  "Tanzania":     "/images/countries/country-tanzania.jpg",
  "Nigeria":      "/images/countries/country-nigeria.jpg",
  "Morocco":      "/images/countries/country-morocco.jpg",
  "China":        "/images/countries/country-china.jpg",
  "Brazil":       "/images/countries/country-brazil.jpg",
  "Global":       "/images/countries/country-global.jpg",
};

const SECTOR_FALLBACKS: Array<[RegExp, string]> = [
  [/port|maritime|logistics|rail|transport/i, imgPort],
  [/solar|renewable|energy|battery|irrigation|water/i, imgSolar],
];

export function resolveCountryArticleImage(countryEN: string, fallback: string): string {
  return COUNTRY_GRID_IMG[countryEN] ?? fallback;
}
import imgGlobalHub from "../assets/images/gci_global_hub_connection_1780768265492.png";
import imgPort from "../assets/images/case_port_shenzhen_1780768345006.png";
import imgSolar from "../assets/images/case_solar_riyadh_1780768308627.png";


export function resolveDailyBriefingImage(country: string | null, sector: string | null, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  const countryImage = COUNTRY_GRID_IMG[(country || "Global").trim()];
  if (countryImage) return countryImage;
  return SECTOR_FALLBACKS.find(([pattern]) => pattern.test(sector || ""))?.[1] || imgGlobalHub;
}
