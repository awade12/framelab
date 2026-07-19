import type { ExportQuality, ExportSize } from "../../types";
import { exportQualityOptions } from "../../constants";
import { SidebarSection } from "./SidebarSection";
import { SidebarSelect } from "./SidebarSelect";
import { STYLES } from "./constants";

interface ExportSectionProps {
  exportSizes: ExportSize[];
  selectedSizeId: string;
  exportQuality: ExportQuality;
  onSizeSelect: (sizeId: string) => void;
  onQualitySelect: (quality: ExportQuality) => void;
}

export const ExportSection = ({
  exportSizes,
  selectedSizeId,
  exportQuality,
  onSizeSelect,
  onQualitySelect,
}: ExportSectionProps) => {
  const selectedSize =
    exportSizes.find((size) => size.id === selectedSizeId) ?? exportSizes[0];
  const isAppStoreSize = selectedSize.appStore === true;

  return (
    <SidebarSection title="Export size">
      <SidebarSelect
        value={selectedSizeId}
        aria-label="Export size"
        onChange={onSizeSelect}
      >
        {exportSizes.map((size) => (
          <option key={size.id} value={size.id} className="bg-[#1a1a1a]">
            {size.label}
          </option>
        ))}
      </SidebarSelect>

      {!isAppStoreSize && (
        <div className="mt-3">
          <p className="mb-2 text-[11px] text-zinc-600">Quality</p>
          <div className={STYLES.segmentTrack}>
            {exportQualityOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onQualitySelect(option.id)}
                className={`${STYLES.segmentButton} ${
                  exportQuality === option.id
                    ? STYLES.segmentActive
                    : STYLES.segmentInactive
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </SidebarSection>
  );
};
