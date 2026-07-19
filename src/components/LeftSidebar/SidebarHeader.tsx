import { HelpCircle, PanelLeftClose } from "lucide-react";
import { APP_NAME } from "../../constants";
import { STYLES } from "./constants";

interface SidebarHeaderProps {
  onCollapse?: () => void;
  onOpenShortcuts?: () => void;
}

export const SidebarHeader = ({
  onCollapse,
  onOpenShortcuts,
}: SidebarHeaderProps) => (
  <div className={STYLES.header}>
    <div className="flex items-center justify-between gap-3">
      <h1 className="min-w-0 text-[15px] font-semibold tracking-tight text-white">
        {APP_NAME}
      </h1>
      <div className="flex shrink-0 items-center gap-0.5">
        {onOpenShortcuts && (
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="p-1 text-zinc-600 transition-colors hover:text-zinc-300"
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <HelpCircle size={16} />
          </button>
        )}
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="p-1 text-zinc-600 transition-colors hover:text-zinc-300"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>
    </div>
  </div>
);
