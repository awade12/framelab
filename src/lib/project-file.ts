import JSZip from "jszip";
import type { Project } from "../types";
import {
  FRAMELAB_PROJECT_VERSION,
  hydrateProjectAssets,
  packProjectAssets,
  downloadProjectArchive,
} from "./project-assets";

export const FRAMELAB_PROJECT_EXTENSION = ".framelab";
export const FRAMELAB_PROJECT_FORMAT = "framelab-project" as const;

export interface FrameLabProjectDocument {
  format: typeof FRAMELAB_PROJECT_FORMAT;
  version: number;
  exportedAt: number;
  project: Project;
}

export const sanitizeProjectFilename = (name: string): string => {
  const sanitized = name
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sanitized || "framelab-project";
};

export const getProjectFileName = (projectName: string): string =>
  `${sanitizeProjectFilename(projectName)}${FRAMELAB_PROJECT_EXTENSION}`;

export const createProjectDocument = (project: Project): FrameLabProjectDocument => ({
  format: FRAMELAB_PROJECT_FORMAT,
  version: FRAMELAB_PROJECT_VERSION,
  exportedAt: Date.now(),
  project,
});

export const serializeProjectDocument = (project: Project): string =>
  JSON.stringify(createProjectDocument(project), null, 2);

export const parseProjectDocument = (raw: string): Project => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid FrameLab project file.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("format" in parsed) ||
    !("project" in parsed)
  ) {
    throw new Error("Invalid FrameLab project file.");
  }

  const document = parsed as FrameLabProjectDocument;

  if (document.format !== FRAMELAB_PROJECT_FORMAT) {
    throw new Error("This file is not a FrameLab project.");
  }

  if (document.version > FRAMELAB_PROJECT_VERSION) {
    throw new Error("This project was saved with a newer version of FrameLab.");
  }

  const project = document.project;
  if (!project || !Array.isArray(project.screenshots) || project.screenshots.length === 0) {
    throw new Error("Project file is missing screenshots.");
  }

  return project;
};

const findProjectEntryName = (zip: JSZip): string | null => {
  const entries = Object.keys(zip.files).filter(
    (name) => !zip.files[name].dir && name.toLowerCase().endsWith(FRAMELAB_PROJECT_EXTENSION),
  );
  return entries[0] ?? null;
};

export const readProjectFromZip = async (zip: JSZip): Promise<Project> => {
  const projectEntry = findProjectEntryName(zip);
  if (!projectEntry) {
    throw new Error("No .framelab project file found in this zip.");
  }
  const content = await zip.file(projectEntry)!.async("string");
  const project = parseProjectDocument(content);

  return hydrateProjectAssets(project, async (path) => {
    const entry = zip.file(path) ?? zip.file(path.replace(/^assets\//, "assets/"));
    if (!entry) return null;
    return entry.async("blob");
  });
};

export const readProjectFromFile = async (file: File): Promise<Project> => {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".zip")) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    return readProjectFromZip(zip);
  }

  if (lowerName.endsWith(FRAMELAB_PROJECT_EXTENSION)) {
    return parseProjectDocument(await file.text());
  }

  throw new Error("Use a .framelab file or a FrameLab export .zip.");
};

export const downloadProjectFile = async (project: Project) => {
  const packed = packProjectAssets(project);
  const archiveName = `${sanitizeProjectFilename(project.name)}.zip`;

  if (packed.assets.size === 0) {
    const blob = new Blob([packed.documentJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = getProjectFileName(project.name);
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  await downloadProjectArchive(packed, archiveName);
};

export const packProjectForExport = (project: Project) => packProjectAssets(project);
