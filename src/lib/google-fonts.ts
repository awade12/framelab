export type FontCategory =
  | "sans-serif"
  | "serif"
  | "display"
  | "monospace"
  | "handwriting";

export interface FontConfig {
  family: string;
  category: FontCategory;
  weights: string[];
  popularity?: number;
}

export const FONT_CATEGORIES: { id: FontCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sans-serif", label: "Sans Serif" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Handwriting" },
  { id: "monospace", label: "Monospace" },
];

export const POPULAR_FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "DM Sans",
  "Plus Jakarta Sans",
  "Manrope",
  "Outfit",
  "Space Grotesk",
  "Nunito",
  "Raleway",
  "Work Sans",
  "Rubik",
  "Sora",
  "Lexend",
  "Oswald",
  "Bebas Neue",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Quicksand",
  "Ubuntu",
  "Archivo",
  "Figtree",
  "Geist",
  "Instrument Sans",
  "Roboto Mono",
  "Source Code Pro",
] as const;

export const popularFonts: FontConfig[] = [
  {
    family: "Inter",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800"],
  },
  {
    family: "Roboto",
    category: "sans-serif",
    weights: ["400", "500", "700", "900"],
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    weights: ["400", "600", "700", "800"],
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Poppins",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Lato",
    category: "sans-serif",
    weights: ["400", "700", "900"],
  },
  {
    family: "DM Sans",
    category: "sans-serif",
    weights: ["400", "500", "700"],
  },
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800"],
  },
  {
    family: "Manrope",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800"],
  },
  {
    family: "Outfit",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Space Grotesk",
    category: "sans-serif",
    weights: ["400", "500", "600", "700"],
  },
  {
    family: "Nunito",
    category: "sans-serif",
    weights: ["400", "600", "700", "800", "900"],
  },
  {
    family: "Raleway",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Work Sans",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Rubik",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Sora",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800"],
  },
  {
    family: "Lexend",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Oswald",
    category: "sans-serif",
    weights: ["400", "500", "600", "700"],
  },
  {
    family: "Bebas Neue",
    category: "display",
    weights: ["400"],
  },
  {
    family: "Playfair Display",
    category: "serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Merriweather",
    category: "serif",
    weights: ["300", "400", "700", "900"],
  },
  {
    family: "Lora",
    category: "serif",
    weights: ["400", "500", "600", "700"],
  },
  {
    family: "Quicksand",
    category: "sans-serif",
    weights: ["400", "500", "600", "700"],
  },
  {
    family: "Ubuntu",
    category: "sans-serif",
    weights: ["400", "500", "700"],
  },
  {
    family: "Archivo",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Figtree",
    category: "sans-serif",
    weights: ["400", "500", "600", "700", "800", "900"],
  },
  {
    family: "Roboto Mono",
    category: "monospace",
    weights: ["400", "500", "600", "700"],
  },
  {
    family: "Source Code Pro",
    category: "monospace",
    weights: ["400", "500", "600", "700", "900"],
  },
];

export const googleFonts = popularFonts;

const CATALOG_CACHE_KEY = "framelab-google-fonts-catalog-v2";
const loadedFonts = new Set<string>();
let catalogPromise: Promise<FontConfig[]> | null = null;

export const generateFontUrl = (family: string, weights: string[] = ["400", "700"]) => {
  const uniqueWeights = [...new Set(weights)].sort((a, b) => Number(a) - Number(b));
  const weightParam = uniqueWeights.join(";");
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weightParam}&display=swap`;
};

export const loadFontFamily = (
  family: string,
  weights: string[] = ["400", "700"],
): Promise<void> => {
  if (loadedFonts.has(family)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.href = generateFontUrl(family, weights);
    link.rel = "stylesheet";
    link.onload = () => {
      loadedFonts.add(family);
      resolve();
    };
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
};

export const loadPopularFonts = () => {
  popularFonts.slice(0, 8).forEach((font) => {
    void loadFontFamily(font.family, font.weights);
  });
};

export const loadGoogleFonts = loadPopularFonts;

export const fetchGoogleFontsCatalog = async (): Promise<FontConfig[]> => {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(CATALOG_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as FontConfig[];
      } catch {
        sessionStorage.removeItem(CATALOG_CACHE_KEY);
      }
    }
  }

  if (catalogPromise) {
    return catalogPromise;
  }

  catalogPromise = (async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}fonts-catalog.json`);
    if (!response.ok) {
      throw new Error("Failed to load fonts catalog");
    }

    const catalog = (await response.json()) as FontConfig[];

    if (typeof window !== "undefined") {
      sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(catalog));
    }

    return catalog;
  })();

  try {
    return await catalogPromise;
  } catch (error) {
    catalogPromise = null;
    throw error;
  }
};

export const isFontLoaded = (family: string) => loadedFonts.has(family);
