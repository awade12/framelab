import { STYLES } from "./constants";

interface GuideTogglesSectionProps {
  showSafeArea: boolean;
  showThirds: boolean;
  showGoldenRatio: boolean;
  onToggleSafeArea: () => void;
  onToggleThirds: () => void;
  onToggleGoldenRatio: () => void;
}

const TOGGLES = [
  { key: "safe", label: "Safe area" },
  { key: "thirds", label: "Thirds" },
  { key: "golden", label: "Golden ratio" },
] as const;

export const GuideTogglesSection = ({
  showSafeArea,
  showThirds,
  showGoldenRatio,
  onToggleSafeArea,
  onToggleThirds,
  onToggleGoldenRatio,
}: GuideTogglesSectionProps) => {
  const active = {
    safe: showSafeArea,
    thirds: showThirds,
    golden: showGoldenRatio,
  };

  const handlers = {
    safe: onToggleSafeArea,
    thirds: onToggleThirds,
    golden: onToggleGoldenRatio,
  };

  return (
    <section className={STYLES.block}>
      <h2 className={STYLES.label}>Composition guides</h2>
      <div className="flex flex-wrap gap-1.5">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={handlers[key]}
            className={`rounded-md px-2.5 py-1.5 text-[11px] transition-colors ring-1 ${
              active[key]
                ? "bg-white/10 text-white ring-white/20"
                : "bg-white/[0.03] text-zinc-500 ring-white/[0.06] hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
