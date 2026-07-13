import type { ImageOverlay, ShadowConfig } from "../types";

export const DEFAULT_OVERLAY_SHADOW: ShadowConfig = {
  enabled: false,
  color: "#000000",
  blur: 20,
  offsetX: 0,
  offsetY: 10,
};

const createId = () => Math.random().toString(36).substring(2, 9);

export type CreateOverlayOptions = {
  x?: number;
  y?: number;
  defaultWidth?: number;
  layer?: "behind" | "front";
};

export const createOverlayFromImage = (
  src: string,
  widthPx: number,
  heightPx: number,
  options: CreateOverlayOptions = {},
): ImageOverlay => {
  const aspectRatio = widthPx / heightPx;
  const overlayWidth = options.defaultWidth ?? 30;

  return {
    id: createId(),
    src,
    x: options.x ?? 50,
    y: options.y ?? 50,
    width: overlayWidth,
    height: overlayWidth / aspectRatio,
    layer: options.layer ?? "front",
    rotation: 0,
    shadow: { ...DEFAULT_OVERLAY_SHADOW },
  };
};

export const readImageFile = (
  file: File,
): Promise<{ src: string; width: number; height: number }> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read file"));
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({
          src: result,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = result;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

export const filterImageFiles = (files: FileList | File[]): File[] =>
  Array.from(files).filter((file) => file.type.startsWith("image/"));

type DragEventLike = {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer;
};

export const hasImageDrag = (event: DragEventLike): boolean =>
  Array.from(event.dataTransfer.items).some(
    (item) => item.kind === "file" && item.type.startsWith("image/"),
  );

export const getDropPositionPercent = (
  event: DragEventLike,
  element: HTMLElement,
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return {
    x: Math.min(95, Math.max(5, x)),
    y: Math.min(95, Math.max(5, y)),
  };
};
