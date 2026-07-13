/**
 * EmptyState Component
 *
 * Displayed when no fonts match the search query.
 */

interface EmptyStateProps {
  /** The search query that returned no results */
  searchQuery: string;
  /** Handler to clear the search */
  onClearSearch: () => void;
}

/**
 * EmptyState - No results message with clear button
 *
 * Shows a friendly message when search returns no fonts,
 * with option to clear the search query.
 *
 * @param props - Component props
 * @param props.searchQuery - Current search query
 * @param props.onClearSearch - Handler to clear search
 *
 * @example
 * <EmptyState
 *   searchQuery="xyz123"
 *   onClearSearch={() => setSearchQuery("")}
 * />
 */
export const EmptyState = ({ searchQuery, onClearSearch }: EmptyStateProps) => (
  <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
    <p className="text-sm text-zinc-400">No fonts found matching "{searchQuery}"</p>
    <button
      type="button"
      onClick={onClearSearch}
      className="rounded-lg border border-white/10 bg-[#252525] px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-[#2f2f2f]"
    >
      Clear search
    </button>
  </div>
);
