import type { RefObject } from "react";
import type { DeviceInstance } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface ScreenshotImageSectionProps {
  device: DeviceInstance;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateDevice: (updates: Partial<DeviceInstance>) => void;
}

export const ScreenshotImageSection = ({
  device,
  fileInputRef,
  onFileUpload,
  onUpdateDevice,
}: ScreenshotImageSectionProps) => (
  <SidebarSection title="Device Screen Image">
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={onFileUpload}
      className="hidden"
    />
    <button
      onClick={() => fileInputRef.current?.click()}
      className={STYLES.uploadButton}
    >
      {device.screenshotSrc ? "Change Image" : "Upload Image"}
    </button>

    {device.screenshotSrc && (
      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-400">Zoom</label>
            <span className="text-[11px] text-zinc-500">{device.screenZoom}%</span>
          </div>
          <input
            type="range"
            min={100}
            max={250}
            value={device.screenZoom}
            onChange={(e) =>
              onUpdateDevice({ screenZoom: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-400">Pan X</label>
            <span className="text-[11px] text-zinc-500">{device.screenOffsetX}</span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={device.screenOffsetX}
            onChange={(e) =>
              onUpdateDevice({ screenOffsetX: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-gray-400">Pan Y</label>
            <span className="text-[11px] text-zinc-500">{device.screenOffsetY}</span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={device.screenOffsetY}
            onChange={(e) =>
              onUpdateDevice({ screenOffsetY: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            onUpdateDevice({
              screenZoom: 100,
              screenOffsetX: 0,
              screenOffsetY: 0,
            })
          }
          className="text-xs text-zinc-400 transition-colors hover:text-white"
        >
          Reset crop
        </button>
      </div>
    )}
  </SidebarSection>
);
