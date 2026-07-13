import { X } from "lucide-react";
import { STYLES } from "./constants";

interface FontPickerHeaderProps {
  onClose: () => void;
}

export const FontPickerHeader = ({ onClose }: FontPickerHeaderProps) => (
  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
    <div>
      <h2 className="text-base font-semibold text-white">Choose a font</h2>
      <p className="text-xs text-zinc-500">
        Browse the full Google Fonts library with live previews
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      className={STYLES.iconButton}
      aria-label="Close font picker"
    >
      <X size={18} />
    </button>
  </div>
);
