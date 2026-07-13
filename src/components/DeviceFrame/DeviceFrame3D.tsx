/**
 * DeviceFrame3D Component
 *
 * Renders a realistic 3D device mockup with smooth rounded edges.
 * Uses a slice-based extrusion technique: stacks thin copies
 * of the device shape at incrementing Z-depths, so the 3D edges
 * perfectly follow the device's border-radius at every corner.
 */

import { useMemo } from "react";
import type { DeviceColor, DeviceInstance, DeviceSpec } from "../../types";
import { SHADOWS } from "./constants";
import { getFrameBackground, getSliceShading } from "./utils";
import { ScreenContent } from "./ScreenContent";
import { CameraElement } from "./CameraElements";
import { StatusBarOverlay } from "./StatusBarOverlay";
import { IPhoneButtons, SamsungButtons } from "./DeviceButtons";

interface DeviceFrame3DProps {
  device: DeviceInstance;
  selectedDevice: DeviceSpec;
  selectedColor: DeviceColor;
}

const EDGE_DEPTH = 18;
const SLICE_COUNT = 40;

export const DeviceFrame3D = ({
  device,
  selectedDevice,
  selectedColor,
}: DeviceFrame3DProps) => {
  const isSamsungDevice = selectedDevice.id.startsWith("samsung-");
  const isSamsungTablet = selectedDevice.id.includes("tab");

  const frameBackground = useMemo(
    () => getFrameBackground(selectedColor),
    [selectedColor],
  );

  const outerRadius = selectedDevice.frameRadius.outer;
  const innerRadius = selectedDevice.frameRadius.inner;

  const sliceStyles = useMemo(() => {
    return Array.from({ length: SLICE_COUNT - 1 }, (_, i) => {
      const t = i / (SLICE_COUNT - 1);
      const z = -EDGE_DEPTH / 2 + t * EDGE_DEPTH;

      return {
        position: "absolute" as const,
        inset: 0,
        borderRadius: outerRadius,
        background: getSliceShading(selectedColor, t),
        transform: `translateZ(${z}px)`,
        boxShadow: `inset 0 0 0 1px rgba(0,0,0,${0.04 + (1 - t) * 0.08})`,
      };
    });
  }, [outerRadius, selectedColor]);

  const frameStyle = useMemo(
    () => ({
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      background: frameBackground,
      borderRadius: outerRadius,
      padding: "1.2%",
      boxShadow: SHADOWS.frame3d,
      transform: `translateZ(${EDGE_DEPTH / 2}px)`,
      backfaceVisibility: "hidden" as const,
    }),
    [selectedDevice, frameBackground, outerRadius],
  );

  const screenStyle = useMemo(
    () => ({
      backgroundColor: "#000",
      borderRadius: innerRadius,
      boxShadow:
        "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 8px rgba(0,0,0,0.4)",
    }),
    [innerRadius],
  );

  return (
    <div
      className="relative w-full"
      style={{
        transformStyle: "preserve-3d",
        aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      }}
    >
      {sliceStyles.map((style, i) => (
        <div key={i} style={style} />
      ))}

      <div className="relative w-full" style={frameStyle}>
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            borderRadius: outerRadius,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)",
          }}
        />

        <div
          className="relative w-full h-full overflow-hidden"
          style={screenStyle}
        >
          <ScreenContent
            screenshotSrc={device.screenshotSrc}
            screenZoom={device.screenZoom}
            screenOffsetX={device.screenOffsetX}
            screenOffsetY={device.screenOffsetY}
          />
          <StatusBarOverlay config={device.statusBar} />
          <CameraElement
            device={selectedDevice}
            isSamsung={isSamsungDevice}
            isSamsungTablet={isSamsungTablet}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              borderRadius: innerRadius,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.12) 100%)",
            }}
          />
        </div>

        {isSamsungDevice ? (
          <SamsungButtons color={selectedColor} is3d />
        ) : (
          <IPhoneButtons color={selectedColor} is3d />
        )}
      </div>
    </div>
  );
};
