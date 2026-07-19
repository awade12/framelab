/**
 * AppearanceSection Component
 *
 * Visual appearance controls including background, text color, font, and screenshot image.
 */

import { ChevronDown } from "lucide-react";
import type { Screenshot, GradientPreset, SolidColorPreset } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { BackgroundPicker } from "./BackgroundPicker";
import { STYLES } from "./constants";

interface AppearanceSectionProps {
  screenshot: Screenshot;
  gradientPresets: GradientPreset[];
  userGradientPresets: GradientPreset[];
  solidColorPresets: SolidColorPreset[];
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  onSaveGradientPreset: (preset: GradientPreset) => void;
  onOpenFontPicker: () => void;
}

/**
 * AppearanceSection - Visual appearance controls
 *
 * Background, text color, font, and screenshot image settings.
 *
 * @param props - Component props
 */
export const AppearanceSection = ({
  screenshot,
  gradientPresets,
  userGradientPresets,
  solidColorPresets,
  onUpdateScreenshot,
  onSaveGradientPreset,
  onOpenFontPicker,
}: AppearanceSectionProps) => (
  <SidebarSection title="Appearance">
    <div className="space-y-4">
      <BackgroundPicker
        screenshot={screenshot}
        gradientPresets={gradientPresets}
        userGradientPresets={userGradientPresets}
        solidColorPresets={solidColorPresets}
        onUpdateScreenshot={onUpdateScreenshot}
        onSaveGradientPreset={onSaveGradientPreset}
      />

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Text Color</label>
        <input
          type="color"
          value={screenshot.textColor}
          onChange={(e) => onUpdateScreenshot({ textColor: e.target.value })}
          className={STYLES.colorInput}
        />
      </div>

      {/* Font Style */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Font Style</label>
        <button onClick={onOpenFontPicker} className={STYLES.dropdownButton}>
          <span style={{ fontFamily: `'${screenshot.fontFamily}', sans-serif` }}>
            {screenshot.fontFamily}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  </SidebarSection>
);
