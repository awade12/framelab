import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { memo, useState, type RefObject } from "react";
import type { ExportScope, Screenshot, ExportSize, SelectedElement } from "../../types";
import type { RenderableDevice } from "../../lib/device-overflow";
import type { SnapGuide } from "../../lib/alignment-snapping";
import { getScreenshotDisplayLabel } from "../../lib/layer-state";
import { getDropPositionPercent, hasImageDrag } from "../../lib/overlay-images";
import { RemoveButton } from "./RemoveButton";
import { AlignmentGuides } from "./AlignmentGuides";
import { OverlayImage } from "./OverlayImage";
import { TextElement } from "./TextElement";
import { DeviceContainer } from "./DeviceContainer";
import { isElementSelected } from "./utils";
import { Z_INDEX } from "./constants";

interface ScreenshotCardProps {
  screenshot: Screenshot;
  renderableDevices: RenderableDevice[];
  isActive: boolean;
  canRemove: boolean;
  selectedElement: SelectedElement | null;
  exportSize: ExportSize;
  headlineFontSize: number;
  subheadlineFontSize: number;
  previewRef: RefObject<HTMLDivElement | null>;
  getBackgroundStyle: (screenshot: Screenshot) => string;
  onSelect: () => void;
  onRemove: () => void;
  onDeselect: () => void;
  onElementMouseDown: (
    e: React.MouseEvent,
    type: "headline" | "subheadline" | "image" | "device",
    screenshotId: string,
    id?: string,
  ) => void;
  onElementMouseUp: () => void;
  onDropAssets?: (files: File[], position: { x: number; y: number }) => void;
  onDropDeviceImage?: (deviceId: string, file: File) => void;
  onUpdateLabel?: (label: string) => void;
  onToggleExport?: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  exportScope?: ExportScope;
  alignmentGuides?: SnapGuide[];
  showThirds?: boolean;
  showGoldenRatio?: boolean;
  showSafeArea?: boolean;
  screenIndex?: number;
  screenTotal?: number;
  onReorderDragStart?: () => void;
  onReorderDragOver?: () => void;
  onReorderDrop?: () => void;
  className?: string;
}

export const ScreenshotCard = memo(function ScreenshotCard({
  screenshot,
  renderableDevices,
  isActive,
  canRemove,
  selectedElement,
  exportSize,
  headlineFontSize,
  subheadlineFontSize,
  previewRef,
  getBackgroundStyle,
  onSelect,
  onRemove,
  onDeselect,
  onElementMouseDown,
  onElementMouseUp,
  onDropAssets,
  onDropDeviceImage,
  onUpdateLabel,
  onToggleExport,
  onNavigatePrev,
  onNavigateNext,
  exportScope,
  alignmentGuides = [],
  showThirds = false,
  showGoldenRatio = false,
  showSafeArea = false,
  screenIndex,
  screenTotal,
  onReorderDragStart,
  onReorderDragOver,
  onReorderDrop,
  className,
}: ScreenshotCardProps) {
  const [isAssetDragOver, setIsAssetDragOver] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelDraft, setLabelDraft] = useState("");

  const displayLabel =
    screenIndex !== undefined
      ? getScreenshotDisplayLabel(screenshot, screenIndex)
      : "";

  const behindImages = screenshot.overlayImages.filter(
    (img) => img.layer === "behind" && !img.hidden,
  );
  const frontImages = screenshot.overlayImages.filter(
    (img) => img.layer !== "behind" && !img.hidden,
  );

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isActive && !target.closest("[data-draggable-element]")) {
      onDeselect();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!onDropAssets || !hasImageDrag(e)) return;
    e.preventDefault();
    setIsAssetDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!onDropAssets || !hasImageDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsAssetDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsAssetDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!onDropAssets || !hasImageDrag(e)) return;
    e.preventDefault();
    setIsAssetDragOver(false);
    onDropAssets(
      Array.from(e.dataTransfer.files),
      getDropPositionPercent(e, e.currentTarget as HTMLElement),
    );
  };

  const commitLabel = () => {
    onUpdateLabel?.(labelDraft);
    setIsEditingLabel(false);
  };

  const handleDeviceDrop = async (deviceId: string, file: File) => {
    if (!onDropDeviceImage) return;
    try {
      onDropDeviceImage(deviceId, file);
    } catch {
      return;
    }
  };

  return (
    <div
      ref={isActive ? previewRef : undefined}
      data-screenshot-card="true"
      className={`group relative h-full shrink-0 overflow-hidden cursor-pointer transition-opacity duration-200 ${
        isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
      } ${isAssetDragOver ? "ring-2 ring-dashed ring-white/70" : ""} ${className ?? ""}`}
      style={{
        background: getBackgroundStyle(screenshot),
        aspectRatio: `${exportSize.width}/${exportSize.height}`,
        boxShadow: isActive
          ? "inset 0 0 0 2px rgba(255, 255, 255, 0.95)"
          : undefined,
      }}
      onClick={onSelect}
      onMouseUp={onElementMouseUp}
      onMouseDown={handleBackgroundMouseDown}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => {
        handleDragOver(event);
        if (onReorderDragOver) {
          event.preventDefault();
          onReorderDragOver();
        }
      }}
      onDragLeave={handleDragLeave}
      onDrop={(event) => {
        if (hasImageDrag(event)) {
          handleDrop(event);
          return;
        }
        if (onReorderDrop) {
          event.preventDefault();
          onReorderDrop();
        }
      }}
    >
      {screenIndex !== undefined && onReorderDragStart && (
        <div
          draggable={!isEditingLabel}
          onDragStart={(event) => {
            event.stopPropagation();
            onReorderDragStart();
          }}
          onDragEnd={() => onReorderDrop?.()}
          onClick={(event) => event.stopPropagation()}
          className="absolute left-2 top-2 z-[400] flex max-w-[calc(100%-1rem)] items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <GripVertical className="h-3 w-3 shrink-0 cursor-grab active:cursor-grabbing" />

          {isEditingLabel ? (
            <input
              autoFocus
              value={labelDraft}
              onChange={(event) => setLabelDraft(event.target.value)}
              onBlur={commitLabel}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitLabel();
                if (event.key === "Escape") setIsEditingLabel(false);
              }}
              onClick={(event) => event.stopPropagation()}
              className="w-20 min-w-0 rounded bg-black/40 px-1 text-[10px] text-white outline-none ring-1 ring-white/20"
            />
          ) : (
            <button
              type="button"
              title="Double-click to rename"
              onDoubleClick={(event) => {
                event.stopPropagation();
                setLabelDraft(screenshot.label ?? displayLabel);
                setIsEditingLabel(true);
              }}
              className="max-w-[5rem] truncate text-left hover:text-white"
            >
              {displayLabel}
            </button>
          )}

          {exportScope === "checked" && onToggleExport && (
            <input
              type="checkbox"
              checked={screenshot.includeInExport !== false}
              onChange={(event) => {
                event.stopPropagation();
                onToggleExport();
              }}
              onClick={(event) => event.stopPropagation()}
              title="Include in export"
              className="h-3 w-3 shrink-0 accent-violet-500"
            />
          )}

          {isActive && (onNavigatePrev || onNavigateNext) && (
            <span className="ml-0.5 flex shrink-0 items-center gap-0.5 border-l border-white/10 pl-1">
              {onNavigatePrev && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigatePrev();
                  }}
                  className="rounded p-0.5 hover:bg-white/10 hover:text-white"
                  title="Previous screen (Alt+←)"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
              )}
              {onNavigateNext && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigateNext();
                  }}
                  className="rounded p-0.5 hover:bg-white/10 hover:text-white"
                  title="Next screen (Alt+→)"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
              {screenTotal !== undefined && screenTotal > 1 && (
                <span className="tabular-nums text-zinc-500">
                  {screenIndex + 1}/{screenTotal}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {isAssetDragOver && (
        <div className="pointer-events-none absolute inset-0 z-[200] flex items-center justify-center bg-black/35">
          <span className="rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            Drop assets here
          </span>
        </div>
      )}

      {canRemove && <RemoveButton onRemove={onRemove} />}

      <div className="absolute inset-0 select-none">
        {behindImages.map((image, index) => (
          <OverlayImage
            key={image.id}
            image={image}
            zIndex={Z_INDEX.behindDevice + index}
            isSelected={isElementSelected(
              isActive ? selectedElement : null,
              "image",
              screenshot.id,
              image.id,
            )}
            isInteractive={isActive && !image.locked}
            onMouseDown={(e) =>
              onElementMouseDown(e, "image", screenshot.id, image.id)
            }
          />
        ))}

        {!screenshot.headlineHidden && (
          <TextElement
            type="headline"
            content={screenshot.headline}
            x={screenshot.headlineX}
            y={screenshot.headlineY}
            width={screenshot.headlineWidth}
            fontSize={headlineFontSize / 3}
            color={screenshot.textColor}
            fontFamily={screenshot.fontFamily}
            isSelected={
              isActive &&
              isElementSelected(selectedElement, "headline", screenshot.id)
            }
            isInteractive={isActive && !screenshot.headlineLocked}
            onMouseDown={(e) => onElementMouseDown(e, "headline", screenshot.id)}
          />
        )}

        {!screenshot.subheadlineHidden && (
          <TextElement
            type="subheadline"
            content={screenshot.subheadline}
            x={screenshot.subheadlineX}
            y={screenshot.subheadlineY}
            width={screenshot.subheadlineWidth}
            fontSize={subheadlineFontSize / 3}
            color={screenshot.textColor}
            fontFamily={screenshot.fontFamily}
            isSelected={
              isActive &&
              isElementSelected(selectedElement, "subheadline", screenshot.id)
            }
            isInteractive={isActive && !screenshot.subheadlineLocked}
            onMouseDown={(e) =>
              onElementMouseDown(e, "subheadline", screenshot.id)
            }
          />
        )}

        {renderableDevices
          .filter(({ device }) => !device.hidden)
          .map(({ device, localX, ownerScreenshotId }, index) => (
            <DeviceContainer
              key={`${ownerScreenshotId}-${device.id}`}
              device={device}
              renderX={localX}
              zIndex={Z_INDEX.device + index}
              isSelected={isElementSelected(
                selectedElement,
                "device",
                ownerScreenshotId,
                device.id,
              )}
              isInteractive={!device.locked}
              onMouseDown={(e) =>
                onElementMouseDown(e, "device", ownerScreenshotId, device.id)
              }
              onDropImage={
                ownerScreenshotId === screenshot.id && onDropDeviceImage
                  ? (file) => handleDeviceDrop(device.id, file)
                  : undefined
              }
            />
          ))}

        {frontImages.map((image, index) => (
          <OverlayImage
            key={image.id}
            image={image}
            zIndex={Z_INDEX.frontDevice + index}
            isSelected={isElementSelected(
              isActive ? selectedElement : null,
              "image",
              screenshot.id,
              image.id,
            )}
            isInteractive={isActive && !image.locked}
            onMouseDown={(e) =>
              onElementMouseDown(e, "image", screenshot.id, image.id)
            }
          />
        ))}
      </div>

      <AlignmentGuides
        guides={alignmentGuides}
        showThirds={showThirds}
        showGoldenRatio={showGoldenRatio}
        showSafeArea={showSafeArea}
      />
    </div>
  );
});
