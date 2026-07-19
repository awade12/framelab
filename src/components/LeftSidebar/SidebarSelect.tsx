import { ChevronDown } from "lucide-react";
import { STYLES } from "./constants";

interface SidebarSelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  "aria-label": string;
}

export const SidebarSelect = ({
  value,
  onChange,
  children,
  "aria-label": ariaLabel,
}: SidebarSelectProps) => (
  <div className="relative">
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className={STYLES.select}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
      aria-hidden
    />
  </div>
);
