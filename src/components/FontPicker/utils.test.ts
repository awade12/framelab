import { describe, expect, it } from "vitest";
import type { FontConfig } from "../../lib/google-fonts";
import {
  filterFonts,
  getPopularFonts,
  paginateFonts,
  FONTS_PAGE_SIZE,
} from "./utils";

const sampleFonts: FontConfig[] = [
  { family: "Inter", category: "sans-serif", weights: ["400", "700"] },
  { family: "Roboto", category: "sans-serif", weights: ["400", "700"] },
  { family: "Playfair Display", category: "serif", weights: ["400", "700"] },
  { family: "Bebas Neue", category: "display", weights: ["400"] },
];

describe("filterFonts", () => {
  it("returns all fonts when query and category are empty", () => {
    expect(filterFonts(sampleFonts, "", "all")).toHaveLength(4);
  });

  it("filters by search query", () => {
    expect(filterFonts(sampleFonts, "rob", "all")).toEqual([
      sampleFonts[1],
    ]);
  });

  it("filters by category", () => {
    expect(filterFonts(sampleFonts, "", "serif")).toEqual([
      sampleFonts[2],
    ]);
  });
});

describe("getPopularFonts", () => {
  it("returns only known popular families", () => {
    const popular = getPopularFonts(sampleFonts);
    expect(popular.map((font) => font.family)).toEqual([
      "Inter",
      "Roboto",
      "Playfair Display",
      "Bebas Neue",
    ]);
  });
});

describe("paginateFonts", () => {
  it("returns the first page of fonts", () => {
    const fonts = Array.from({ length: FONTS_PAGE_SIZE + 10 }, (_, index) => ({
      family: `Font ${index}`,
      category: "sans-serif" as const,
      weights: ["400"],
    }));

    expect(paginateFonts(fonts, 1)).toHaveLength(FONTS_PAGE_SIZE);
    expect(paginateFonts(fonts, 2)).toHaveLength(FONTS_PAGE_SIZE + 10);
  });
});
