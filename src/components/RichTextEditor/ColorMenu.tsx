import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { STYLES } from "./constants";
import { normalizeHex } from "./utils";

interface ColorMenuProps {
  value: string;
  presets: readonly string[];
  onChange: (color: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  tooltip: string;
  icon: ReactNode;
  allowClear?: boolean;
  onClear?: () => void;
}

export const ColorMenu = ({
  value,
  presets,
  onChange,
  onMouseDown,
  tooltip,
  icon,
  allowClear = false,
  onClear,
}: ColorMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = normalizeHex(value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={STYLES.tooltipWrapper}>
      <button
        type="button"
        aria-label={tooltip}
        aria-expanded={open}
        onMouseDown={onMouseDown}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative ${STYLES.toolbarButton} ${
          open ? STYLES.toolbarButtonActive : STYLES.toolbarButtonInactive
        }`}
      >
        {icon}
        <span
          className="absolute bottom-0.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: value }}
        />
      </button>

      {!open && (
        <div aria-hidden="true" className={STYLES.tooltip}>
          {tooltip}
        </div>
      )}

      {open && (
        <div className={STYLES.colorMenu} role="dialog" aria-label={tooltip}>
          <div className="mb-2 grid grid-cols-5 gap-1.5">
            {presets.map((preset) => {
              const isActive = normalizeHex(preset) === current;
              return (
                <button
                  key={preset}
                  type="button"
                  title={preset}
                  onMouseDown={onMouseDown}
                  onClick={() => {
                    onChange(preset);
                    setOpen(false);
                  }}
                  className={`${STYLES.colorSwatch} ${
                    isActive ? STYLES.colorSwatchActive : ""
                  }`}
                  style={{ backgroundColor: preset }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-2">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(current) ? current : "#ffffff"}
              onMouseDown={onMouseDown}
              onChange={(event) => onChange(event.target.value)}
              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label={`${tooltip} custom`}
            />
            <span className="flex-1 truncate font-mono text-[10px] text-zinc-400">
              {current}
            </span>
            {allowClear && onClear && (
              <button
                type="button"
                onMouseDown={onMouseDown}
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="rounded px-1.5 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
