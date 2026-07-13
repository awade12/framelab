import { Search, X } from "lucide-react";
import { STYLES } from "./constants";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  isLoading: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  resultCount,
  totalCount,
  isLoading,
}: SearchInputProps) => (
  <div className="space-y-3 border-b border-white/10 bg-[#1a1a1a] px-4 py-3">
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        size={16}
      />
      <input
        type="text"
        placeholder="Search 1,000+ Google Fonts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={STYLES.input}
        autoFocus
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>

    <div className="flex items-center justify-between text-xs text-zinc-500">
      <span>
        {isLoading
          ? "Loading Google Fonts catalog..."
          : `Showing ${resultCount.toLocaleString()} of ${totalCount.toLocaleString()} fonts`}
      </span>
    </div>
  </div>
);
