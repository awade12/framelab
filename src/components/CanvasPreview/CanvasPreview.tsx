import { useEffect, useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { getRenderableDevicesForScreenshot } from "../../lib/device-overflow";
import { readImageFile } from "../../lib/overlay-images";
import { ScreenshotCard } from "./ScreenshotCard";
import { CanvasZoomControls } from "./CanvasZoomControls";
import { useResizeObserver } from "./useResizeObserver";

export const CanvasPreview = () => {
  const {
    screenshots,
    activeScreenshotId,
    setActiveScreenshotId,
    setSelectedElement,
    removeScreenshot,
    handleElementMouseDown,
    handleElementMouseUp,
    getBackgroundStyle,
    previewRef,
    canvasContainerRef,
    selectedElement,
    headlineFontSize,
    subheadlineFontSize,
    setPreviewDimensions,
    exportSize,
    addOverlayImages,
    isDragging,
    snapGuides,
    guideSettings,
    reorderScreenshots,
    canvasZoom,
    setCanvasZoom,
    exportScope,
    updateScreenshotLabel,
    toggleScreenshotExport,
    navigateScreenshot,
    assignDeviceScreenshot,
  } = useEditor();

  const [dragScreenshotIndex, setDragScreenshotIndex] = useState<number | null>(
    null,
  );
  const [dropScreenshotIndex, setDropScreenshotIndex] = useState<number | null>(
    null,
  );
  const [fitScale, setFitScale] = useState(1);

  useResizeObserver({
    elementRef: previewRef,
    onResize: setPreviewDimensions,
    deps: [activeScreenshotId, canvasZoom],
  });

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateFitScale = () => {
      const padding = 48;
      const availableHeight = Math.max(container.clientHeight - padding, 200);
      const availableWidth = Math.max(container.clientWidth - padding, 320);
      const aspect = exportSize.width / exportSize.height;
      const naturalHeight = availableHeight;
      const naturalWidth = naturalHeight * aspect;
      const widthScale = availableWidth / naturalWidth;
      setFitScale(Math.min(1, widthScale));
    };

    updateFitScale();
    const observer = new ResizeObserver(updateFitScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasContainerRef, exportSize]);

  const effectiveScale = canvasZoom === "fit" ? fitScale : canvasZoom;

  const finishScreenshotReorder = () => {
    if (
      dragScreenshotIndex !== null &&
      dropScreenshotIndex !== null &&
      dragScreenshotIndex !== dropScreenshotIndex
    ) {
      reorderScreenshots(dragScreenshotIndex, dropScreenshotIndex);
    }
    setDragScreenshotIndex(null);
    setDropScreenshotIndex(null);
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <CanvasZoomControls zoom={canvasZoom} onChange={setCanvasZoom} />
      <div
        ref={canvasContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden bg-[#0a0a0a] p-6"
      >
        <div
          className="flex min-w-max items-stretch origin-top-left transition-transform duration-150"
          style={{
            transform: `scale(${effectiveScale})`,
            height: `${100 / effectiveScale}%`,
          }}
        >
          {screenshots.map((screenshot, index) => {
            const renderableDevices = getRenderableDevicesForScreenshot(
              screenshots,
              index,
            );
            const isActive = activeScreenshotId === screenshot.id;
            const isDropTarget =
              dropScreenshotIndex === index &&
              dragScreenshotIndex !== null &&
              dragScreenshotIndex !== index;

            return (
              <ScreenshotCard
                key={screenshot.id}
                className={isDropTarget ? "scale-[0.98] opacity-80" : undefined}
                screenshot={screenshot}
                renderableDevices={renderableDevices}
                isActive={isActive}
                canRemove={screenshots.length > 1}
                selectedElement={selectedElement}
                exportSize={exportSize}
                headlineFontSize={headlineFontSize}
                subheadlineFontSize={subheadlineFontSize}
                previewRef={previewRef}
                getBackgroundStyle={getBackgroundStyle}
                screenIndex={index}
                screenTotal={screenshots.length}
                exportScope={exportScope}
                onReorderDragStart={() => setDragScreenshotIndex(index)}
                onReorderDragOver={() => setDropScreenshotIndex(index)}
                onReorderDrop={finishScreenshotReorder}
                onSelect={() => {
                  if (!isActive) {
                    setActiveScreenshotId(screenshot.id);
                    setSelectedElement(null);
                  }
                }}
                onRemove={() => removeScreenshot(screenshot.id)}
                onDeselect={() => setSelectedElement(null)}
                onElementMouseDown={handleElementMouseDown}
                onElementMouseUp={handleElementMouseUp}
                onDropAssets={(files, position) =>
                  addOverlayImages(files, {
                    screenshotId: screenshot.id,
                    x: position.x,
                    y: position.y,
                  })
                }
                onDropDeviceImage={async (deviceId, file) => {
                  try {
                    const { src } = await readImageFile(file);
                    assignDeviceScreenshot(screenshot.id, deviceId, src);
                  } catch {
                    return;
                  }
                }}
                onUpdateLabel={(label) =>
                  updateScreenshotLabel(screenshot.id, label)
                }
                onToggleExport={() => toggleScreenshotExport(screenshot.id)}
                onNavigatePrev={
                  isActive && index > 0
                    ? () => navigateScreenshot("prev")
                    : undefined
                }
                onNavigateNext={
                  isActive && index < screenshots.length - 1
                    ? () => navigateScreenshot("next")
                    : undefined
                }
                alignmentGuides={isActive ? snapGuides : []}
                showThirds={
                  isActive &&
                  (guideSettings.showThirds || (isDragging && isActive))
                }
                showGoldenRatio={
                  isActive &&
                  (guideSettings.showGoldenRatio || (isDragging && isActive))
                }
                showSafeArea={isActive && guideSettings.showSafeArea}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
