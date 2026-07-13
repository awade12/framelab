import { useEffect, useMemo, useState } from "react";
import type { FontCategory } from "../../lib/google-fonts";
import { loadFontFamily } from "../../lib/google-fonts";
import { useGoogleFontsCatalog } from "../../hooks/useGoogleFontsCatalog";
import { FontPickerHeader } from "./FontPickerHeader";
import { SearchInput } from "./SearchInput";
import { CategoryTabs } from "./CategoryTabs";
import { FontGrid } from "./FontGrid";
import { FontPickerFooter } from "./FontPickerFooter";
import { filterFonts, type PreviewMode } from "./utils";
import { STYLES } from "./constants";

interface FontPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFontFamily: string;
  onSelect: (fontFamily: string) => void;
}

const getCategoryCounts = (
  fonts: { category: FontCategory }[],
  total: number,
) => ({
  all: total,
  "sans-serif": fonts.filter((font) => font.category === "sans-serif").length,
  serif: fonts.filter((font) => font.category === "serif").length,
  display: fonts.filter((font) => font.category === "display").length,
  handwriting: fonts.filter((font) => font.category === "handwriting").length,
  monospace: fonts.filter((font) => font.category === "monospace").length,
});

export const FontPicker = ({
  isOpen,
  onClose,
  selectedFontFamily,
  onSelect,
}: FontPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<FontCategory | "all">("all");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("headline");
  const [page, setPage] = useState(1);

  const { fonts, isLoading, error, retry } = useGoogleFontsCatalog(isOpen);

  const filteredFonts = useMemo(
    () => filterFonts(fonts, searchQuery, category),
    [category, fonts, searchQuery],
  );

  const categoryCounts = useMemo(
    () => getCategoryCounts(fonts, fonts.length),
    [fonts],
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !selectedFontFamily) return;
    const selected = fonts.find((font) => font.family === selectedFontFamily);
    if (selected) {
      void loadFontFamily(selected.family, selected.weights);
    }
  }, [fonts, isOpen, selectedFontFamily]);

  const handleSelect = (fontFamily: string) => {
    const selected = fonts.find((font) => font.family === fontFamily);
    if (selected) {
      void loadFontFamily(selected.family, selected.weights);
    }
    onSelect(fontFamily);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setCategory("all");
    setPage(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={STYLES.backdrop}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={STYLES.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Font picker"
      >
        <FontPickerHeader onClose={handleClose} />

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={filteredFonts.length}
          totalCount={fonts.length}
          isLoading={isLoading}
        />

        <div className="space-y-3 border-b border-white/10 px-4 py-3">
          <CategoryTabs
            activeCategory={category}
            onChange={(value) => setCategory(value as FontCategory | "all")}
            counts={categoryCounts}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Preview:</span>
            {(["headline", "body"] as PreviewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPreviewMode(mode)}
                className={`rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                  previewMode === mode
                    ? "bg-white text-black"
                    : "bg-[#252525] text-zinc-400 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void retry()}
                className="font-medium underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <FontGrid
          fonts={filteredFonts}
          allFonts={fonts}
          selectedFontFamily={selectedFontFamily}
          searchQuery={searchQuery}
          category={category}
          previewMode={previewMode}
          isLoading={isLoading}
          page={page}
          onSelect={handleSelect}
          onClearSearch={() => setSearchQuery("")}
          onLoadMore={() => setPage((current) => current + 1)}
        />

        <FontPickerFooter onCancel={handleClose} />
      </div>
    </div>
  );
};
