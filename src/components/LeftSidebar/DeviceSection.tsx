import type { DeviceSpec } from "../../types";
import { ColorButton } from "./ColorButton";
import { SidebarSection } from "./SidebarSection";
import { SidebarSelect } from "./SidebarSelect";
import { STYLES } from "./constants";

interface DeviceSectionProps {
  devices: DeviceSpec[];
  selectedDeviceId: string;
  selectedColorId: string;
  selectedDevice: DeviceSpec;
  onDeviceSelect: (deviceId: string, defaultColorId: string) => void;
  onColorSelect: (colorId: string) => void;
}

export const DeviceSection = ({
  devices,
  selectedDeviceId,
  selectedColorId,
  selectedDevice,
  onDeviceSelect,
  onColorSelect,
}: DeviceSectionProps) => (
  <SidebarSection title="Device">
    <SidebarSelect
      value={selectedDeviceId}
      aria-label="Device"
      onChange={(deviceId) => {
        const device = devices.find((item) => item.id === deviceId);
        if (device) onDeviceSelect(deviceId, device.colors[0].id);
      }}
    >
      {devices.map((device) => (
        <option key={device.id} value={device.id} className="bg-[#1a1a1a]">
          {device.label}
        </option>
      ))}
    </SidebarSelect>

    <div className="mt-3 flex items-center justify-between gap-3">
      <span className="text-[11px] text-zinc-600">Color</span>
      <div className={STYLES.colorPicker}>
        {selectedDevice.colors.map((color) => (
          <ColorButton
            key={color.id}
            color={color.frame}
            label={color.label}
            isSelected={selectedColorId === color.id}
            onClick={() => onColorSelect(color.id)}
          />
        ))}
      </div>
    </div>
  </SidebarSection>
);
