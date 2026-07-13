import type { FontConfig } from "../../lib/google-fonts";
import type { FontCategory } from "../../lib/google-fonts";
import { FontCard } from "./FontCard";
import { EmptyState } from "./EmptyState";
import { FontGridSkeleton } from "./FontGridSkeleton";
import { getPopularFonts, paginateFonts, type PreviewMode } from "./utils";

interface FontGridProps {
  fonts: FontConfig[];
  allFonts: FontConfig[];
  selectedFontFamily: string;
  searchQuery: string;
  category: FontCategory | "all";
  previewMode: PreviewMode;
  isLoading: boolean;
  page: number;
  onSelect: (fontFamily: string) => void;
  onClearSearch: () => void;
  onLoadMore: () => void;
}

export const FontGrid = ({
  fonts,
  allFonts,
  selectedFontFamily,
  searchQuery,
  category,
  previewMode,
  isLoading,
  page,
  onSelect,
  onClearSearch,
  onLoadMore,
}: FontGridProps) => {
  const showPopular = !searchQuery && category === "all" && !isLoading;
  const popularFonts = showPopular ? getPopularFonts(allFonts) : [];
  const popularFamilies = new Set(popularFonts.map((font) => font.family));
  const browseFonts = showPopular
    ? fonts.filter((font) => !popularFamilies.has(font.family))
    : fonts;
  const visibleFonts = paginateFonts(browseFonts, page);
  const hasMore = visibleFonts.length < browseFonts.length;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <FontGridSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {showPopular && popularFonts.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Popular for App Store
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {popularFonts.map((font) => (
              <FontCard
                key={`popular-${font.family}`}
                font={font}
                isSelected={selectedFontFamily === font.family}
                previewMode={previewMode}
                onSelect={() => onSelect(font.family)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        {showPopular && (
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            All Fonts
          </h3>
        )}

        {browseFonts.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visibleFonts.map((font) => (
                <FontCard
                  key={font.family}
                  font={font}
                  isSelected={selectedFontFamily === font.family}
                  previewMode={previewMode}
                  onSelect={() => onSelect(font.family)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="rounded-lg border border-white/10 bg-[#252525] px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-[#2f2f2f] hover:text-white"
                >
                  Load more fonts
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
