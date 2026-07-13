import { describe, expect, it } from "vitest";
import {
  getExportScale,
  getExportSizeById,
  getOutputDimensions,
  migrateExportQuality,
  migrateExportSizeId,
} from "./export-sizes";

describe("migrateExportSizeId", () => {
  it("maps legacy ids to App Store sizes without losing the selection intent", () => {
    expect(migrateExportSizeId("6.7")).toBe("iphone-1290");
    expect(migrateExportSizeId("6.5")).toBe("iphone-1260");
    expect(migrateExportSizeId("iphone-1290")).toBe("iphone-1290");
  });
});

describe("getExportScale", () => {
  it("locks App Store exports to 1x exact pixels", () => {
    const appStoreSize = getExportSizeById("iphone-1290");
    expect(getExportScale(appStoreSize, 3)).toBe(1);
  });

  it("allows quality scaling for non-store sizes", () => {
    const playStoreSize = getExportSizeById("play-phone");
    expect(getExportScale(playStoreSize, 2)).toBe(2);
  });
});

describe("getOutputDimensions", () => {
  it("returns exact App Store dimensions for iPhone exports", () => {
    const size = getExportSizeById("iphone-1260");
    expect(getOutputDimensions(size, 3)).toEqual({
      width: 1260,
      height: 2736,
      scale: 1,
    });
  });
});

describe("migrateExportQuality", () => {
  it("resets ultra quality to standard for App Store sizes", () => {
    expect(migrateExportQuality("6.7", 3)).toBe(1);
    expect(migrateExportQuality("play-phone", 3)).toBe(3);
  });
});
