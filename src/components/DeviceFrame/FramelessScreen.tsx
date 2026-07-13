import type { DeviceSpec, DeviceInstance } from "../../types";
import { ScreenContent } from "./ScreenContent";
import { StatusBarOverlay } from "./StatusBarOverlay";

interface FramelessScreenProps {
  device: {
    screenshotSrc: string | null;
    screenZoom: number;
    screenOffsetX: number;
    screenOffsetY: number;
    statusBar: DeviceInstance["statusBar"];
  };
  selectedDevice: DeviceSpec;
}

export const FramelessScreen = ({
  device,
  selectedDevice,
}: FramelessScreenProps) => (
  <div
    className="relative w-full overflow-hidden shadow-2xl"
    style={{
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      borderRadius: selectedDevice.frameRadius.inner,
      backgroundColor: "#1c1c1e",
    }}
  >
    <ScreenContent
      screenshotSrc={device.screenshotSrc}
      screenZoom={device.screenZoom}
      screenOffsetX={device.screenOffsetX}
      screenOffsetY={device.screenOffsetY}
    />
    <StatusBarOverlay config={device.statusBar} />
  </div>
);
