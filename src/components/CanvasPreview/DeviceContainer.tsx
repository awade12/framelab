import { useState } from "react";
import type { DeviceInstance } from "../../types";
import { SelectionHandles } from "./SelectionHandles";
import { DeviceFrame } from "../DeviceFrame";
import { DeviceFrame3D } from "../DeviceFrame/DeviceFrame3D";
import { FramelessScreen } from "../DeviceFrame/FramelessScreen";
import { getDeviceSelectionStyles, getDropShadowFilter } from "./utils";
import { getDeviceColorById, getDeviceSpecById } from "../../lib/device-instances";
import { hasImageDrag } from "../../lib/overlay-images";

interface DeviceContainerProps {
  device: DeviceInstance;
  renderX?: number;
  zIndex: number;
  isSelected: boolean;
  isInteractive: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDropImage?: (file: File) => void;
}

export const DeviceContainer = ({
  device,
  renderX = device.x,
  zIndex,
  isSelected,
  isInteractive,
  onMouseDown,
  onDropImage,
}: DeviceContainerProps) => {
  const [isDropOver, setIsDropOver] = useState(false);
  const is3D = device.style === "3d";
  const showFrame = device.showFrame !== false;
  const selectedDevice = getDeviceSpecById(device.deviceId);
  const selectedColor = getDeviceColorById(selectedDevice.id, device.colorId);

  const frameContent = !showFrame ? (
    <FramelessScreen device={device} selectedDevice={selectedDevice} />
  ) : is3D ? (
    <DeviceFrame3D
      device={device}
      selectedDevice={selectedDevice}
      selectedColor={selectedColor}
    />
  ) : (
    <DeviceFrame
      device={device}
      selectedDevice={selectedDevice}
      selectedColor={selectedColor}
    />
  );

  const handleDragOver = (event: React.DragEvent) => {
    if (!onDropImage || !hasImageDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setIsDropOver(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    if (!onDropImage || !hasImageDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDropOver(false);
    const file = event.dataTransfer.files[0];
    if (file) onDropImage(file);
  };

  return (
    <div
      data-draggable-element="device"
      className="absolute cursor-move select-none"
      style={{
        left: `${renderX}%`,
        width: `${device.scale}%`,
        top: `${device.y}%`,
        transform: "translateX(-50%)",
        zIndex,
        filter: getDropShadowFilter(device.shadow),
        perspective: is3D ? "1200px" : undefined,
      }}
      onMouseDown={isInteractive ? onMouseDown : undefined}
      onClick={(e) => e.stopPropagation()}
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setIsDropOver(false);
      }}
      onDrop={handleDrop}
    >
      <div
        className="relative"
        style={
          is3D
            ? {
                transform: `rotateY(${device.rotateY}deg) rotateX(${device.rotateX}deg)`,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                ...getDeviceSelectionStyles(isSelected),
              }
            : {
                transform: `rotate(${device.rotation}deg)`,
                transformOrigin: "center center",
                ...getDeviceSelectionStyles(isSelected),
              }
        }
      >
        {frameContent}
        {isDropOver && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-violet-500/25 ring-2 ring-violet-400/60">
            <span className="rounded bg-black/70 px-2 py-1 text-[10px] text-white">
              Set screen image
            </span>
          </div>
        )}
        {isSelected && <SelectionHandles />}
      </div>
    </div>
  );
};
