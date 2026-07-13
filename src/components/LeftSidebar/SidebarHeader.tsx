/**
 * SidebarHeader Component
 *
 * Header section with app title and project switcher.
 */

import { PanelLeftClose } from "lucide-react";
import { APP_NAME } from "../../constants";
import { ProjectSwitcher } from "../ProjectSwitcher";
import { STYLES } from "./constants";

interface SidebarHeaderProps {
  onCollapse?: () => void;
}

export const SidebarHeader = ({ onCollapse }: SidebarHeaderProps) => (
  <div className={STYLES.header}>
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-base font-semibold tracking-tight">{APP_NAME} Editor</h1>
        <p className="text-[11px] text-zinc-500 mt-0.5">
          App Store & Google Play screenshots
        </p>
      </div>
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          className="shrink-0 rounded-md border border-white/10 bg-[#2a2a2a] p-1.5 text-zinc-400 transition-colors hover:bg-[#333] hover:text-white"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      )}
    </div>
    <div className="mt-3">
      <ProjectSwitcher />
    </div>
  </div>
);
