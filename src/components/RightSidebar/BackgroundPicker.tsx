import type { Screenshot, GradientPreset, SolidColorPreset } from "../../types";
import { buildGradientCss } from "../../lib/gradient-utils";
import { CustomGradientEditor } from "./CustomGradientEditor";
import { STYLES } from "./constants";

interface BackgroundPickerProps {
  screenshot: Screenshot;
  gradientPresets: GradientPreset[];
  userGradientPresets: GradientPreset[];
  solidColorPresets: SolidColorPreset[];
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  onSaveGradientPreset: (preset: GradientPreset) => void;
}

const normalizeHex = (color: string) => color.trim().toLowerCase();

export const BackgroundPicker = ({
  screenshot,
  gradientPresets,
  userGradientPresets,
  solidColorPresets,
  onUpdateScreenshot,
  onSaveGradientPreset,
}: BackgroundPickerProps) => {
  const currentColor = normalizeHex(screenshot.backgroundColor);
  const hasPresetMatch = solidColorPresets.some(
    (preset) => normalizeHex(preset.color) === currentColor,
  );
  const allGradientPresets = [...gradientPresets, ...userGradientPresets];
  const isCustomGradient = screenshot.gradientPresetId === "custom";

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">Background</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "solid" })}
            className={`${STYLES.modeButton} ${
              screenshot.backgroundMode === "solid"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "gradient" })}
            className={`${STYLES.modeButton} ${
              screenshot.backgroundMode === "gradient"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Gradient
          </button>
        </div>

        {screenshot.backgroundMode === "solid" ? (
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-1.5 max-h-52 overflow-y-auto pr-0.5">
              {solidColorPresets.map((preset) => {
                const isSelected = normalizeHex(preset.color) === currentColor;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    title={preset.label}
                    onClick={() =>
                      onUpdateScreenshot({ backgroundColor: preset.color })
                    }
                    className={`${STYLES.solidColorButton} ${
                      isSelected ? STYLES.solidColorButtonActive : ""
                    }`}
                    style={{ backgroundColor: preset.color }}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={screenshot.backgroundColor}
                onChange={(e) =>
                  onUpdateScreenshot({ backgroundColor: e.target.value })
                }
                className={`${STYLES.colorInputSmall} shrink-0`}
                title="Custom color"
              />
              <input
                type="text"
                value={screenshot.backgroundColor}
                onChange={(e) =>
                  onUpdateScreenshot({ backgroundColor: e.target.value })
                }
                className="flex-1 rounded-md border border-white/10 bg-[#2a2a2a] px-2 py-1 text-xs text-gray-200 outline-none focus:border-white/30"
                spellCheck={false}
              />
              {!hasPresetMatch && (
                <span className="text-[10px] text-zinc-500 shrink-0">Custom</span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
              {allGradientPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.label}
                  onClick={() =>
                    onUpdateScreenshot({
                      gradientPresetId: preset.id,
                      customGradient: null,
                    })
                  }
                  className={`${STYLES.gradientButton} ${
                    screenshot.gradientPresetId === preset.id &&
                    !isCustomGradient
                      ? STYLES.gradientButtonActive
                      : ""
                  }`}
                  style={{
                    background: buildGradientCss(
                      preset.from,
                      preset.to,
                      preset.angle ?? 180,
                    ),
                  }}
                />
              ))}
              <button
                type="button"
                title="Custom gradient"
                onClick={() =>
                  onUpdateScreenshot({
                    gradientPresetId: "custom",
                    customGradient: screenshot.customGradient ?? {
                      from: "#8b5cf6",
                      to: "#ec4899",
                      angle: 160,
                    },
                  })
                }
                className={`${STYLES.gradientButton} flex items-center justify-center text-[10px] text-zinc-400 ${
                  isCustomGradient ? STYLES.gradientButtonActive : ""
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomGradient && screenshot.customGradient && (
              <CustomGradientEditor
                gradient={screenshot.customGradient}
                userPresets={userGradientPresets}
                onChange={(gradient) =>
                  onUpdateScreenshot({ customGradient: gradient })
                }
                onSavePreset={onSaveGradientPreset}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
