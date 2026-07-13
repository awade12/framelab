import type { FontCategory, FontConfig } from "../../lib/google-fonts";
import { POPULAR_FONT_FAMILIES } from "../../lib/google-fonts";

export type GoogleFont = FontConfig;

export type PreviewMode = "headline" | "body";

export const PREVIEW_TEXT: Record<PreviewMode, string> = {
  headline: "Track every flight in real time",
  body: "The quick brown fox jumps over the lazy dog",
};

export const FONTS_PAGE_SIZE = 48;

export const filterFonts = (
  fonts: FontConfig[],
  query: string,
  category: FontCategory | "all",
): FontConfig[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return fonts.filter((font) => {
    const matchesCategory = category === "all" || font.category === category;
    const matchesQuery =
      !normalizedQuery || font.family.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
};

export const getPopularFonts = (fonts: FontConfig[]): FontConfig[] => {
  const popularSet = new Set<string>(POPULAR_FONT_FAMILIES);
  return fonts.filter((font) => popularSet.has(font.family)).slice(0, 12);
};

export const paginateFonts = (fonts: FontConfig[], page: number) =>
  fonts.slice(0, page * FONTS_PAGE_SIZE);

export const getFontFamily = (family: string, category: string): string =>
  `"${family}", ${category}`;

export const getCategoryLabel = (category: FontCategory) =>
  category.replace("-", " ");
