import { STYLES } from "./constants";

export type RightSidebarTab = "device" | "text" | "style" | "layers";

const TABS: { id: RightSidebarTab; label: string }[] = [
  { id: "device", label: "Device" },
  { id: "text", label: "Text" },
  { id: "style", label: "Style" },
  { id: "layers", label: "Layers" },
];

interface SidebarTabsProps {
  activeTab: RightSidebarTab;
  onTabChange: (tab: RightSidebarTab) => void;
}

export const SidebarTabs = ({ activeTab, onTabChange }: SidebarTabsProps) => (
  <div className={STYLES.tabBar}>
    <div className={STYLES.tabList} role="tablist" aria-label="Inspector sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${STYLES.tab} ${
            activeTab === tab.id ? STYLES.tabActive : STYLES.tabInactive
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);
