import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const CATEGORY_MAP = {
  "Sans Serif": "sans-serif",
  Serif: "serif",
  Display: "display",
  Monospace: "monospace",
  Handwriting: "handwriting",
};

const parseWeights = (fonts) => {
  const weights = new Set();
  for (const variant of Object.keys(fonts ?? {})) {
    const weight = variant.split(",")[0].replace("italic", "").trim();
    if (/^\d+$/.test(weight)) {
      weights.add(weight);
    }
  }
  return [...weights].sort((a, b) => Number(a) - Number(b));
};

const response = await fetch("https://fonts.google.com/metadata/fonts");
if (!response.ok) {
  throw new Error("Failed to fetch Google Fonts metadata");
}

const data = await response.json();
const catalog = data.familyMetadataList
  .map((entry) => ({
    family: entry.family,
    category: CATEGORY_MAP[entry.category] ?? "sans-serif",
    weights: parseWeights(entry.fonts),
    popularity: entry.popularity,
  }))
  .map((entry) => ({
    ...entry,
    weights: entry.weights.length > 0 ? entry.weights : ["400", "700"],
  }))
  .sort((a, b) => (a.popularity ?? 9999) - (b.popularity ?? 9999));

const outputPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/fonts-catalog.json",
);

writeFileSync(outputPath, JSON.stringify(catalog));
console.log(`Wrote ${catalog.length} fonts to ${outputPath}`);
