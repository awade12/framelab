import { STYLES } from "./constants";

interface CategoryTabsProps {
  activeCategory: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "sans-serif", label: "Sans Serif" },
  { id: "serif", label: "Serif" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Handwriting" },
  { id: "monospace", label: "Monospace" },
];

export const CategoryTabs = ({
  activeCategory,
  onChange,
  counts,
}: CategoryTabsProps) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
    {tabs.map((tab) => {
      const isActive = activeCategory === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`${STYLES.categoryTab} ${
            isActive ? STYLES.categoryTabActive : STYLES.categoryTabInactive
          }`}
        >
          {tab.label}
          <span className={`ml-1.5 ${isActive ? "text-zinc-600" : "text-zinc-500"}`}>
            {counts[tab.id] ?? 0}
          </span>
        </button>
      );
    })}
  </div>
);
