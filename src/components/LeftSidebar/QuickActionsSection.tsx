import { Plus, Redo2, Undo2 } from "lucide-react";
import { STYLES } from "./constants";

interface QuickActionsSectionProps {
  screenshotCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onAddScreenshot: () => void;
  onOpenTemplates: () => void;
  onApplyStyleToAll: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const QuickActionsSection = ({
  screenshotCount,
  canUndo,
  canRedo,
  onAddScreenshot,
  onOpenTemplates,
  onApplyStyleToAll,
  onDuplicate,
  onUndo,
  onRedo,
}: QuickActionsSectionProps) => (
  <section className={STYLES.block}>
    <div className={STYLES.labelRow}>
      <h2 className="text-[11px] font-medium text-zinc-500">Screenshots</h2>
      <span className={STYLES.meta}>
        {screenshotCount} {screenshotCount === 1 ? "screen" : "screens"}
      </span>
    </div>

    <button
      type="button"
      onClick={onAddScreenshot}
      className={`${STYLES.primaryButton} flex items-center justify-center gap-1.5`}
    >
      <Plus className="h-4 w-4" />
      Add screenshot
    </button>

    <div className="mt-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1">
        <button
          type="button"
          onClick={onOpenTemplates}
          className={STYLES.ghostLink}
        >
          Templates
        </button>
        <span className="text-zinc-700">·</span>
        <button
          type="button"
          onClick={onDuplicate}
          title="⌘D"
          className={STYLES.ghostLink}
        >
          Duplicate
        </button>
        <span className="text-zinc-700">·</span>
        <button
          type="button"
          onClick={onApplyStyleToAll}
          className={STYLES.ghostLink}
        >
          Style all
        </button>
      </div>

      <div className="flex shrink-0 gap-0.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          className={STYLES.iconButton}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          className={STYLES.iconButton}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
);
