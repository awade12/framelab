import type { CustomGradient, GradientPreset } from "../../types";
import { DEFAULT_CUSTOM_GRADIENT, buildGradientCss } from "../../lib/gradient-utils";
import { STYLES } from "./constants";

interface CustomGradientEditorProps {
  gradient: CustomGradient;
  userPresets: GradientPreset[];
  onChange: (gradient: CustomGradient) => void;
  onSavePreset: (preset: GradientPreset) => void;
}

export const CustomGradientEditor = ({
  gradient,
  userPresets,
  onChange,
  onSavePreset,
}: CustomGradientEditorProps) => {
  const preview = buildGradientCss(gradient.from, gradient.to, gradient.angle);

  const handleSave = () => {
    const label = window.prompt("Preset name", "My gradient");
    if (!label?.trim()) return;
    onSavePreset({
      id: `custom-${Date.now()}`,
      label: label.trim(),
      from: gradient.from,
      to: gradient.to,
      angle: gradient.angle,
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-[#141414] p-3">
      <div
        className="h-10 rounded-md ring-1 ring-white/10"
        style={{ background: preview }}
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[10px] text-zinc-500">From</span>
          <input
            type="color"
            value={gradient.from}
            onChange={(event) =>
              onChange({ ...gradient, from: event.target.value })
            }
            className={STYLES.colorInputSmall}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] text-zinc-500">To</span>
          <input
            type="color"
            value={gradient.to}
            onChange={(event) =>
              onChange({ ...gradient, to: event.target.value })
            }
            className={STYLES.colorInputSmall}
          />
        </label>
      </div>

      <label className="block">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">Angle</span>
          <span className="text-[10px] text-zinc-400">{gradient.angle}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={gradient.angle}
          onChange={(event) =>
            onChange({ ...gradient, angle: Number(event.target.value) })
          }
          className="w-full accent-white"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(DEFAULT_CUSTOM_GRADIENT)}
          className={`${STYLES.modeButton} ${STYLES.modeButtonInactive} flex-1 text-[11px]`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`${STYLES.modeButton} ${STYLES.modeButtonInactive} flex-1 text-[11px]`}
        >
          Save preset
        </button>
      </div>

      {userPresets.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {userPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() =>
                onChange({
                  from: preset.from,
                  to: preset.to,
                  angle: preset.angle ?? 180,
                })
              }
              className={`${STYLES.gradientButton}`}
              style={{
                background: buildGradientCss(
                  preset.from,
                  preset.to,
                  preset.angle ?? 180,
                ),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
