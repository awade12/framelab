import type { Project, Screenshot } from "../types";

export const FRAMELAB_PROJECT_VERSION = 2;
export const ASSET_PREFIX = "assets/";
export const ASSET_SCHEME = "asset://";

export const isDataUrl = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.startsWith("data:");

export const isAssetRef = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.startsWith(ASSET_SCHEME);

export const toAssetRef = (path: string) => `${ASSET_SCHEME}${path}`;

export const fromAssetRef = (ref: string) =>
  ref.startsWith(ASSET_SCHEME) ? ref.slice(ASSET_SCHEME.length) : ref;

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, body] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const bytes = atob(body);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index++) {
    buffer[index] = bytes.charCodeAt(index);
  }
  return new Blob([buffer], { type: mime });
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export type PackedProject = {
  documentJson: string;
  assets: Map<string, Blob>;
};

const deviceAssetPath = (screenshotId: string, deviceId: string) =>
  `${ASSET_PREFIX}devices/${screenshotId}-${deviceId}.png`;

const overlayAssetPath = (screenshotId: string, overlayId: string) =>
  `${ASSET_PREFIX}overlays/${screenshotId}-${overlayId}.png`;

export const packProjectAssets = (project: Project): PackedProject => {
  const assets = new Map<string, Blob>();
  const screenshots = project.screenshots.map((screenshot) =>
    packScreenshotAssets(screenshot, assets),
  );

  const document = {
    format: "framelab-project" as const,
    version: FRAMELAB_PROJECT_VERSION,
    exportedAt: Date.now(),
    project: {
      ...project,
      screenshots,
    },
  };

  return {
    documentJson: JSON.stringify(document, null, 2),
    assets,
  };
};

const packScreenshotAssets = (
  screenshot: Screenshot,
  assets: Map<string, Blob>,
): Screenshot => ({
  ...screenshot,
  devices: screenshot.devices.map((device) => {
    if (!isDataUrl(device.screenshotSrc)) return device;
    const path = deviceAssetPath(screenshot.id, device.id);
    assets.set(path, dataUrlToBlob(device.screenshotSrc));
    return { ...device, screenshotSrc: toAssetRef(path) };
  }),
  overlayImages: screenshot.overlayImages.map((overlay) => {
    if (!isDataUrl(overlay.src)) return overlay;
    const path = overlayAssetPath(screenshot.id, overlay.id);
    assets.set(path, dataUrlToBlob(overlay.src));
    return { ...overlay, src: toAssetRef(path) };
  }),
});

export const hydrateProjectAssets = async (
  project: Project,
  assetResolver: (path: string) => Promise<Blob | null>,
): Promise<Project> => ({
  ...project,
  screenshots: await Promise.all(
    project.screenshots.map((screenshot) =>
      hydrateScreenshotAssets(screenshot, assetResolver),
    ),
  ),
});

const hydrateScreenshotAssets = async (
  screenshot: Screenshot,
  assetResolver: (path: string) => Promise<Blob | null>,
): Promise<Screenshot> => ({
  ...screenshot,
  devices: await Promise.all(
    screenshot.devices.map(async (device) => {
      if (!isAssetRef(device.screenshotSrc)) return device;
      const blob = await assetResolver(fromAssetRef(device.screenshotSrc));
      if (!blob) return { ...device, screenshotSrc: null };
      return { ...device, screenshotSrc: await blobToDataUrl(blob) };
    }),
  ),
  overlayImages: await Promise.all(
    screenshot.overlayImages.map(async (overlay) => {
      if (!isAssetRef(overlay.src)) return overlay;
      const blob = await assetResolver(fromAssetRef(overlay.src));
      if (!blob) return overlay;
      return { ...overlay, src: await blobToDataUrl(blob) };
    }),
  ),
});

export const downloadProjectArchive = async (
  packed: PackedProject,
  archiveName: string,
) => {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const projectName =
    JSON.parse(packed.documentJson).project?.name ?? "framelab-project";
  const safeName =
    projectName
      .trim()
      .replace(/[^\w\s-]+/g, "")
      .replace(/\s+/g, "-") || "framelab-project";

  zip.file(`${safeName}.framelab`, packed.documentJson);
  for (const [path, blob] of packed.assets.entries()) {
    zip.file(path, blob);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = archiveName;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
