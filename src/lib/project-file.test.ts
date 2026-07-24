import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import type { Project } from "../types";
import {
  FRAMELAB_PROJECT_FORMAT,
  getProjectFileName,
  parseProjectDocument,
  readProjectFromFile,
  serializeProjectDocument,
} from "./project-file";

const sampleProject: Project = {
  id: "proj-1",
  name: "Launch Screens",
  createdAt: 1,
  updatedAt: 2,
  screenshots: [
    {
      id: "shot-1",
      headline: "Hello",
      subheadline: "World",
      backgroundColor: "#000000",
      backgroundMode: "solid",
      backgroundImageSrc: null,
      backgroundImageZoom: 100,
      backgroundImageOffsetX: 0,
      backgroundImageOffsetY: 0,
      gradientPresetId: null,
      textColor: "#ffffff",
      headlineX: 50,
      headlineY: 10,
      headlineWidth: 80,
      subheadlineX: 50,
      subheadlineY: 18,
      subheadlineWidth: 80,
      fontFamily: "Inter",
      overlayImages: [],
      devices: [],
      activeDeviceId: "device-1",
    },
  ],
  selectedDeviceId: "iphone-15-pro-max",
  selectedColorId: "black-titanium",
  exportSizeId: "iphone-1260",
  exportQuality: 1,
  activeScreenshotId: "shot-1",
  headlineFontSize: 72,
  subheadlineFontSize: 42,
};

describe("project-file", () => {
  it("serializes and parses a project document", () => {
    const raw = serializeProjectDocument(sampleProject);
    const parsed = parseProjectDocument(raw);
    expect(parsed.name).toBe("Launch Screens");
    expect(parsed.screenshots).toHaveLength(1);
  });

  it("builds a safe project filename", () => {
    expect(getProjectFileName("My Project!")).toBe("My-Project.framelab");
  });

  it("reads a project from a zip export", async () => {
    const zip = new JSZip();
    zip.file("launch-screens.framelab", serializeProjectDocument(sampleProject));
    const blob = await zip.generateAsync({ type: "blob" });
    const file = new File([blob], "launch-screens.zip", {
      type: "application/zip",
    });

    const imported = await readProjectFromFile(file);
    expect(imported.name).toBe("Launch Screens");
  });

  it("rejects unknown formats", () => {
    expect(() =>
      parseProjectDocument(JSON.stringify({ format: "other", project: sampleProject })),
    ).toThrow("not a FrameLab project");
  });

  it("rejects documents without screenshots", () => {
    expect(() =>
      parseProjectDocument(
        JSON.stringify({
          format: FRAMELAB_PROJECT_FORMAT,
          version: 1,
          exportedAt: Date.now(),
          project: { ...sampleProject, screenshots: [] },
        }),
      ),
    ).toThrow("missing screenshots");
  });
});
