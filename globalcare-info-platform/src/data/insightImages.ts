// Existing country-specific images used by the Insights market grid and article cards.
export const COUNTRY_GRID_IMG: Record<string, string> = {
  "UAE / Dubai":  "/images/countries/country-uae.jpg",
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

export function resolveCountryArticleImage(countryEN: string, fallback: string): string {
  return COUNTRY_GRID_IMG[countryEN] ?? fallback;
}
