import { Tooltip } from "./Tooltip";
import { STYLES } from "./constants";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  tooltip: string;
  children: React.ReactNode;
  onMouseDown?: (e: React.MouseEvent) => void;
  wide?: boolean;
  disabled?: boolean;
}

export const ToolbarButton = ({
  onClick,
  active = false,
  tooltip,
  children,
  onMouseDown,
  wide = false,
  disabled = false,
}: ToolbarButtonProps) => (
  <Tooltip content={tooltip}>
    <button
      type="button"
      onMouseDown={onMouseDown}
      onClick={onClick}
      disabled={disabled}
      aria-label={tooltip}
      aria-pressed={active}
      className={`${wide ? STYLES.toolbarButtonWide : STYLES.toolbarButton} ${
        active ? STYLES.toolbarButtonActive : STYLES.toolbarButtonInactive
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  </Tooltip>
);
