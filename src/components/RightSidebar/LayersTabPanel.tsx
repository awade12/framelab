import { useMemo, useState } from "react";
import type { SelectedElement } from "../../types";
import { buildLayerStack, type LayerEntry } from "../../lib/layer-stack";
import { useEditor } from "../../context/EditorContext";
import { OverlayImageProperties } from "./OverlayImageProperties";
import {
  UnifiedLayersPanel,
  layerEntryKey,
} from "./UnifiedLayersPanel";

const matchesSelection = (
  entry: LayerEntry,
  selected: SelectedElement,
): boolean => {
  if (entry.kind === "headline" && selected.type === "headline") return true;
  if (entry.kind === "subheadline" && selected.type === "subheadline") {
    return true;
  }
  if (
    entry.kind === "device" &&
    selected.type === "device" &&
    entry.id === selected.id
  ) {
    return true;
  }
  if (
    entry.kind === "overlay" &&
    selected.type === "image" &&
    entry.id === selected.id
  ) {
    return true;
  }
  return false;
};

export const LayersTabPanel = () => {
  const {
    activeScreenshot,
    selectedElement,
    setSelectedElement,
    removeOverlayImage,
    updateOverlayImageSize,
    updateOverlayImageLayer,
    updateOverlayImageRotation,
    updateOverlayImageShadow,
    reorderLayers,
    toggleOverlayLayer,
    toggleLayerHidden,
    toggleLayerLocked,
    overlayImageInputRef,
  } = useEditor();

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const layers = buildLayerStack(activeScreenshot);

  const selectedKey = useMemo(() => {
    if (
      !selectedElement ||
      selectedElement.screenshotId !== activeScreenshot.id
    ) {
      return null;
    }
    const entry = layers.find((item) =>
      matchesSelection(item, selectedElement),
    );
    return entry ? layerEntryKey(entry) : null;
  }, [activeScreenshot.id, layers, selectedElement]);

  const selectedImage =
    selectedElement?.type === "image" && selectedElement.id
      ? activeScreenshot.overlayImages.find(
          (image) => image.id === selectedElement.id,
        )
      : null;

  const handleSelect = (entry: LayerEntry) => {
    if (entry.kind === "headline") {
      setSelectedElement({
        type: "headline",
        screenshotId: activeScreenshot.id,
      });
      return;
    }
    if (entry.kind === "subheadline") {
      setSelectedElement({
        type: "subheadline",
        screenshotId: activeScreenshot.id,
      });
      return;
    }
    if (entry.kind === "device") {
      setSelectedElement({
        type: "device",
        id: entry.id,
        screenshotId: activeScreenshot.id,
      });
      return;
    }
    setSelectedElement({
      type: "image",
      id: entry.id,
      screenshotId: activeScreenshot.id,
    });
  };

  const finishReorder = () => {
    if (
      dragIndex !== null &&
      dropIndex !== null &&
      dragIndex !== dropIndex
    ) {
      reorderLayers(dragIndex, dropIndex);
    }
    setDragIndex(null);
    setDropIndex(null);
  };

  return (
    <div className="space-y-4">
      <UnifiedLayersPanel
        screenshot={activeScreenshot}
        layers={layers}
        selectedKey={selectedKey}
        dragIndex={dragIndex}
        dropIndex={dropIndex}
        onSelect={handleSelect}
        onDragStart={setDragIndex}
        onDragOver={setDropIndex}
        onDragEnd={finishReorder}
        onToggleOverlayLayer={toggleOverlayLayer}
        onToggleHidden={toggleLayerHidden}
        onToggleLocked={toggleLayerLocked}
        onAddAsset={() => overlayImageInputRef.current?.click()}
      />

      {selectedImage && (
        <OverlayImageProperties
          image={selectedImage}
          onSizeChange={(size) => updateOverlayImageSize(selectedImage.id, size)}
          onRotationChange={(rotation) =>
            updateOverlayImageRotation(selectedImage.id, rotation)
          }
          onLayerChange={(layer) =>
            updateOverlayImageLayer(selectedImage.id, layer)
          }
          onShadowToggle={() =>
            updateOverlayImageShadow(selectedImage.id, {
              enabled: !selectedImage.shadow?.enabled,
            })
          }
          onShadowColorChange={(color) =>
            updateOverlayImageShadow(selectedImage.id, { color })
          }
          onShadowBlurChange={(blur) =>
            updateOverlayImageShadow(selectedImage.id, { blur })
          }
          onShadowOffsetYChange={(offsetY) =>
            updateOverlayImageShadow(selectedImage.id, { offsetY })
          }
        />
      )}

      {selectedElement?.type === "image" && selectedElement.id && (
        <button
          type="button"
          onClick={() => removeOverlayImage(selectedElement.id!)}
          className="w-full rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
        >
          Remove asset
        </button>
      )}
    </div>
  );
};
