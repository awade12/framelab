import type { ExportQuality, ExportSize } from "../types";
import { exportSizes } from "../constants";

const LEGACY_EXPORT_SIZE_IDS: Record<string, string> = {
  "6.7": "iphone-1290",
  "6.5": "iphone-1260",
  "5.5": "iphone-1260",
  "6.9": "iphone-1260",
  "4k": "iphone-1320",
};

export const migrateExportSizeId = (exportSizeId: string): string => {
  if (exportSizes.some((size) => size.id === exportSizeId)) {
    return exportSizeId;
  }
  return LEGACY_EXPORT_SIZE_IDS[exportSizeId] ?? exportSizes[0].id;
};

export const getExportSizeById = (exportSizeId: string): ExportSize => {
  const migratedId = migrateExportSizeId(exportSizeId);
  return exportSizes.find((size) => size.id === migratedId) ?? exportSizes[0];
};

export const getExportScale = (
  exportSize: ExportSize,
  exportQuality: ExportQuality,
): ExportQuality => {
  if (exportSize.appStore) {
    return 1;
  }
  return exportQuality;
};

export const migrateExportQuality = (
  exportSizeId: string,
  exportQuality: ExportQuality | undefined,
): ExportQuality => {
  const exportSize = getExportSizeById(exportSizeId);
  if (exportSize.appStore) {
    return 1;
  }
  if (exportQuality === 1 || exportQuality === 2 || exportQuality === 3) {
    return exportQuality;
  }
  return 1;
};

export const getOutputDimensions = (
  exportSize: ExportSize,
  exportQuality: ExportQuality,
) => {
  const scale = getExportScale(exportSize, exportQuality);
  return {
    width: exportSize.width * scale,
    height: exportSize.height * scale,
    scale,
  };
};
