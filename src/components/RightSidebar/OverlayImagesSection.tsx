import type { RefObject } from "react";
import type { Screenshot, ShadowConfig } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { OverlayImageItem } from "./OverlayImageItem";
import { OverlayImageProperties } from "./OverlayImageProperties";
import { AlignControls } from "./AlignControls";
import { STYLES } from "./constants";
import type { SelectedElement } from "./types";

interface OverlayImagesSectionProps {
  screenshot: Screenshot;
  selectedElement: SelectedElement | null;
  overlayImageInputRef: RefObject<HTMLInputElement | null>;
  onSelectElement: (element: SelectedElement | null) => void;
  onAddImage: (file: File) => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onUpdateSize: (id: string, size: number) => void;
  onUpdateLayer: (id: string, layer: "behind" | "front") => void;
  onUpdateRotation: (id: string, rotation: number) => void;
  onUpdateShadow: (id: string, shadow: Partial<ShadowConfig>) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
}

export const OverlayImagesSection = ({
  screenshot,
  selectedElement,
  overlayImageInputRef,
  onSelectElement,
  onAddImage,
  onAddImages,
  onRemoveImage,
  onUpdateSize,
  onUpdateLayer,
  onUpdateRotation,
  onUpdateShadow,
  onBringForward,
  onSendBackward,
}: OverlayImagesSectionProps) => {
  const selectedImage =
    selectedElement?.type === "image" &&
    selectedElement.screenshotId === screenshot.id &&
    selectedElement.id
      ? screenshot.overlayImages.find((img) => img.id === selectedElement.id)
      : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length === 1) {
      onAddImage(files[0]);
    } else {
      onAddImages(Array.from(files));
    }
    e.target.value = "";
  };

  return (
    <SidebarSection title="Custom Assets">
      <div className="space-y-2">
        <p className="text-[11px] leading-4 text-gray-500">
          Drop logos, badges, icons, or PNG/SVG graphics onto any screenshot.
          Drag to reposition after adding.
        </p>
        <input
          ref={overlayImageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => overlayImageInputRef.current?.click()}
          className={STYLES.uploadButton}
        >
          + Add Asset
        </button>

        {screenshot.overlayImages.length > 0 && (
          <div className="space-y-2 mt-3">
            {screenshot.overlayImages.map((img, index) => (
              <OverlayImageItem
                key={img.id}
                image={img}
                index={index}
                totalCount={screenshot.overlayImages.length}
                isSelected={
                  selectedElement?.type === "image" &&
                  selectedElement?.screenshotId === screenshot.id &&
                  selectedElement?.id === img.id
                }
                onSelect={() =>
                  onSelectElement({
                    type: "image",
                    id: img.id,
                    screenshotId: screenshot.id,
                  })
                }
                onRemove={() => onRemoveImage(img.id)}
                onMoveForward={() => onBringForward(img.id)}
                onMoveBackward={() => onSendBackward(img.id)}
              />
            ))}

            {selectedImage && (
              <>
                <AlignControls />
                <OverlayImageProperties
                image={selectedImage}
                onSizeChange={(size) => onUpdateSize(selectedImage.id, size)}
                onRotationChange={(rotation) =>
                  onUpdateRotation(selectedImage.id, rotation)
                }
                onLayerChange={(layer) =>
                  onUpdateLayer(selectedImage.id, layer)
                }
                onShadowToggle={() =>
                  onUpdateShadow(selectedImage.id, {
                    enabled: !selectedImage.shadow?.enabled,
                  })
                }
                onShadowColorChange={(color) =>
                  onUpdateShadow(selectedImage.id, { color })
                }
                onShadowBlurChange={(blur) =>
                  onUpdateShadow(selectedImage.id, { blur })
                }
                onShadowOffsetYChange={(offsetY) =>
                  onUpdateShadow(selectedImage.id, { offsetY })
                }
                />
              </>
            )}
          </div>
        )}
      </div>
    </SidebarSection>
  );
};
