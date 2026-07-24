import { useRef } from "react";
import type { Screenshot, GradientPreset, SolidColorPreset } from "../../types";
import { buildGradientCss } from "../../lib/gradient-utils";
import { readImageFile } from "../../lib/overlay-images";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentColor = normalizeHex(screenshot.backgroundColor);
  const hasPresetMatch = solidColorPresets.some(
    (preset) => normalizeHex(preset.color) === currentColor,
  );
  const allGradientPresets = [...gradientPresets, ...userGradientPresets];
  const isCustomGradient = screenshot.gradientPresetId === "custom";
  const mode = screenshot.backgroundMode;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const { src } = await readImageFile(file);
      onUpdateScreenshot({
        backgroundMode: "image",
        backgroundImageSrc: src,
        backgroundImageZoom: 100,
        backgroundImageOffsetX: 0,
        backgroundImageOffsetY: 0,
      });
    } catch {
      return;
    }
  };

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">Background</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "solid" })}
            className={`${STYLES.modeButton} ${
              mode === "solid"
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
              mode === "gradient"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Gradient
          </button>
          <button
            type="button"
            onClick={() => onUpdateScreenshot({ backgroundMode: "image" })}
            className={`${STYLES.modeButton} ${
              mode === "image"
                ? STYLES.modeButtonActive
                : STYLES.modeButtonInactive
            }`}
          >
            Image
          </button>
        </div>

        {mode === "solid" ? (
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
        ) : mode === "gradient" ? (
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
        ) : (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {screenshot.backgroundImageSrc ? (
              <div
                className="h-20 w-full rounded-md border border-white/10 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${screenshot.backgroundImageSrc}")`,
                  backgroundColor: screenshot.backgroundColor,
                }}
              />
            ) : (
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-white/15 bg-[#2a2a2a] text-[11px] text-zinc-500">
                No background image
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={STYLES.uploadButton}
            >
              {screenshot.backgroundImageSrc ? "Change Image" : "Upload Image"}
            </button>
            {screenshot.backgroundImageSrc && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateScreenshot({
                      backgroundImageSrc: null,
                      backgroundMode: "solid",
                      backgroundImageZoom: 100,
                      backgroundImageOffsetX: 0,
                      backgroundImageOffsetY: 0,
                    })
                  }
                  className="text-xs text-zinc-400 transition-colors hover:text-white"
                >
                  Remove image
                </button>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs text-gray-400">Zoom</label>
                    <span className="text-[11px] text-zinc-500">
                      {screenshot.backgroundImageZoom ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={250}
                    value={screenshot.backgroundImageZoom ?? 100}
                    onChange={(e) =>
                      onUpdateScreenshot({
                        backgroundImageZoom: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs text-gray-400">Pan X</label>
                    <span className="text-[11px] text-zinc-500">
                      {screenshot.backgroundImageOffsetX ?? 0}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={screenshot.backgroundImageOffsetX ?? 0}
                    onChange={(e) =>
                      onUpdateScreenshot({
                        backgroundImageOffsetX: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs text-gray-400">Pan Y</label>
                    <span className="text-[11px] text-zinc-500">
                      {screenshot.backgroundImageOffsetY ?? 0}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={screenshot.backgroundImageOffsetY ?? 0}
                    onChange={(e) =>
                      onUpdateScreenshot({
                        backgroundImageOffsetY: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateScreenshot({
                      backgroundImageZoom: 100,
                      backgroundImageOffsetX: 0,
                      backgroundImageOffsetY: 0,
                    })
                  }
                  className="text-xs text-zinc-400 transition-colors hover:text-white"
                >
                  Reset crop
                </button>
              </div>
            )}
            <div>
              <label className="mb-1 block text-[10px] text-zinc-500">
                Fallback color
              </label>
              <input
                type="color"
                value={screenshot.backgroundColor}
                onChange={(e) =>
                  onUpdateScreenshot({ backgroundColor: e.target.value })
                }
                className={STYLES.colorInput}
                title="Fallback color while image loads"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
