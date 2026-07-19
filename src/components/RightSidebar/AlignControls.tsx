import type { AlignMode, DistributeMode, SnapPreset } from "../../lib/alignment-actions";
import { useEditor } from "../../context/EditorContext";
import { STYLES } from "./constants";

const ALIGN_ACTIONS: { mode: AlignMode; label: string; shortcut?: string }[] = [
  { mode: "center-h", label: "Center H", shortcut: "⌘⇧H" },
  { mode: "center-v", label: "Center V", shortcut: "⌘⇧V" },
  { mode: "center", label: "Center", shortcut: "⌘⇧M" },
  { mode: "to-device", label: "To Device", shortcut: "⌘⇧D" },
  { mode: "align-left", label: "Left edge" },
  { mode: "align-right", label: "Right edge" },
  { mode: "align-top", label: "Top edge" },
  { mode: "align-bottom", label: "Bottom edge" },
  { mode: "match-width", label: "Match width" },
  { mode: "match-height", label: "Match height" },
];

const PRESET_ACTIONS: { preset: SnapPreset; label: string }[] = [
  { preset: "headline-above-device", label: "Headline above device" },
  { preset: "subheadline-under-headline", label: "Subheadline under headline" },
  { preset: "device-bottom-bleed", label: "Device bottom bleed" },
];

const DISTRIBUTE_ACTIONS: { mode: DistributeMode; label: string }[] = [
  { mode: "distribute-h", label: "Space evenly ↔" },
  { mode: "distribute-v", label: "Space evenly ↕" },
];

export const AlignControls = () => {
  const {
    alignSelected,
    distributeElements,
    applySnapPresetToActive,
    selectedElement,
    activeScreenshotId,
  } = useEditor();

  const canAlign =
    selectedElement && selectedElement.screenshotId === activeScreenshotId;

  return (
    <div className="space-y-4">
      {canAlign && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Align selection</span>
            <span className="text-[10px] text-gray-500">[ ] rotate 15°</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {ALIGN_ACTIONS.map(({ mode, label, shortcut }) => (
              <button
                key={mode}
                type="button"
                onClick={() => alignSelected(mode)}
                className={`${STYLES.modeButton} ${STYLES.modeButtonInactive} flex flex-col items-start gap-0.5 px-2 py-1.5 text-left`}
              >
                <span className="text-[11px]">{label}</span>
                {shortcut && (
                  <span className="text-[10px] text-gray-500">{shortcut}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block text-xs text-gray-400">Snap presets</span>
        <div className="space-y-1">
          {PRESET_ACTIONS.map(({ preset, label }) => (
            <button
              key={preset}
              type="button"
              onClick={() => applySnapPresetToActive(preset)}
              className={`${STYLES.modeButton} ${STYLES.modeButtonInactive} w-full px-2 py-1.5 text-left text-[11px]`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs text-gray-400">
          Distribute (2+ devices or assets)
        </span>
        <div className="grid grid-cols-2 gap-1">
          {DISTRIBUTE_ACTIONS.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => distributeElements(mode)}
              className={`${STYLES.modeButton} ${STYLES.modeButtonInactive} px-2 py-1.5 text-[11px]`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
