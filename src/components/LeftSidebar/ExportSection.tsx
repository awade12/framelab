import type { ExportQuality, ExportSize } from "../../types";
import { exportQualityOptions } from "../../constants";
import { getOutputDimensions } from "../../lib/export-sizes";
import { SidebarSection } from "./SidebarSection";
import { SelectionButton } from "./SelectionButton";
import { STYLES } from "./constants";

interface ExportSectionProps {
  exportSizes: ExportSize[];
  selectedSizeId: string;
  exportQuality: ExportQuality;
  screenshotCount: number;
  isExporting: boolean;
  onSizeSelect: (sizeId: string) => void;
  onQualitySelect: (quality: ExportQuality) => void;
  onExport: () => void;
}

export const ExportSection = ({
  exportSizes,
  selectedSizeId,
  exportQuality,
  screenshotCount,
  isExporting,
  onSizeSelect,
  onQualitySelect,
  onExport,
}: ExportSectionProps) => {
  const selectedSize =
    exportSizes.find((size) => size.id === selectedSizeId) ?? exportSizes[0];
  const { width: outputWidth, height: outputHeight } = getOutputDimensions(
    selectedSize,
    exportQuality,
  );
  const isAppStoreSize = selectedSize.appStore === true;

  return (
    <SidebarSection title="Export">
      <p className="mb-3 text-[11px] leading-4 text-zinc-500">
        iPhone App Store sizes match Apple&apos;s required pixel dimensions
        exactly.
      </p>
      <div className={STYLES.buttonList}>
        {exportSizes.map((size) => (
          <SelectionButton
            key={size.id}
            label={size.label}
            isSelected={selectedSizeId === size.id}
            onClick={() => onSizeSelect(size.id)}
          />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {isAppStoreSize ? (
          <p className="text-[11px] text-zinc-500">
            App Store export uses exact store pixels (no 2×/3× scaling).
          </p>
        ) : (
          <>
            <label className="block text-xs text-gray-400">Download quality</label>
            <div className={STYLES.buttonList}>
              {exportQualityOptions.map((option) => (
                <SelectionButton
                  key={option.id}
                  label={`${option.label} · ${option.description}`}
                  isSelected={exportQuality === option.id}
                  onClick={() => onQualitySelect(option.id)}
                />
              ))}
            </div>
          </>
        )}
        <p className="text-[11px] text-zinc-500">
          Output {outputWidth.toLocaleString()}×{outputHeight.toLocaleString()} PNG
        </p>
      </div>

      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className={`${STYLES.primaryButton} mt-4 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isExporting ? "Exporting…" : `Export All (${screenshotCount})`}
      </button>
    </SidebarSection>
  );
};
