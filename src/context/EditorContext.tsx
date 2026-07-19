import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  DeviceSpec,
  DeviceColor,
  DeviceInstance,
  ExportSize,
  ExportQuality,
  Screenshot,
  ImageOverlay,
  ShadowConfig,
  Project,
  SelectedElement,
  ExportScope,
  CanvasZoom,
  GradientPreset,
} from "../types";
import { devices, exportSizes, exportQualityOptions } from "../constants";
import {
  getExportSizeById,
  getOutputDimensions,
  migrateExportQuality,
  migrateExportSizeId,
} from "../lib/export-sizes";
import {
  downloadExportFiles,
  renderExportFiles,
} from "../lib/export-utils";
import {
  downloadProjectFile,
  getProjectFileName,
  packProjectForExport,
  readProjectFromFile,
  sanitizeProjectFilename,
} from "../lib/project-file";
import { getScreenshotBackgroundStyle } from "../lib/gradient-utils";
import {
  getExportScreenshots,
  isSelectedElementLocked,
  toggleLayerLock,
  toggleLayerVisibility,
} from "../lib/layer-state";
import type { LayerEntry } from "../lib/layer-stack";
import {
  createInitialExportProgress,
  runPostRenderPhases,
  type ExportProgressState,
} from "../lib/export-progress";
import {
  cloneDeviceInstance,
  createDeviceInstance,
  ensureDeviceInstances,
  getDeviceColorById,
  getDeviceSpecById,
} from "../lib/device-instances";
import {
  applyScreenshotTemplate,
  applyStyleFromScreenshot,
  screenshotTemplates,
  type ScreenshotTemplate,
} from "../lib/templates";
import {
  collectAlignmentTargets,
  getSnapThresholdPercent,
  snapDragPosition,
  type SnapGuide,
} from "../lib/alignment-snapping";
import {
  applySnapPreset,
  distributeScreenshotElements,
  getAlignUpdates,
  getRotationStepUpdate,
  snapAngle,
  type AlignMode,
  type DistributeMode,
  type SnapPreset,
  OVERLAY_ROTATION_SNAP,
} from "../lib/alignment-actions";
import {
  loadGuideSettings,
  saveGuideSettings,
  type GuideSettings,
} from "../lib/guide-settings";
import {
  reorderLayerStack,
  setOverlayLayer,
} from "../lib/layer-stack";
import {
  createOverlayFromImage,
  filterImageFiles,
  readImageFile,
} from "../lib/overlay-images";
import {
  loadPersistedState,
  useEditorPersistence,
  clearPersistedState,
} from "../lib/useLocalStorage";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface EditorContextType {
  // Project state
  projects: Project[];
  activeProjectId: string;
  activeProject: Project;
  createProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  switchProject: (id: string) => void;

  // State
  isFontPickerOpen: boolean;
  setIsFontPickerOpen: (open: boolean) => void;
  isStarModalOpen: boolean;
  setIsStarModalOpen: (open: boolean) => void;
  exportProgress: ExportProgressState;
  isExporting: boolean;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  selectedColorId: string;
  setSelectedColorId: (id: string) => void;
  exportSizeId: string;
  setExportSizeId: (id: string) => void;
  exportQuality: ExportQuality;
  setExportQuality: (quality: ExportQuality) => void;
  screenshots: Screenshot[];
  setScreenshots: (screenshots: Screenshot[]) => void;
  activeScreenshotId: string;
  setActiveScreenshotId: (id: string) => void;
  selectedElement: SelectedElement | null;
  setSelectedElement: (element: SelectedElement | null) => void;
  isDragging: boolean;
  snapGuides: SnapGuide[];
  headlineFontSize: number;
  setHeadlineFontSize: (size: number) => void;
  subheadlineFontSize: number;
  setSubheadlineFontSize: (size: number) => void;
  previewDimensions: { width: number; height: number };
  setPreviewDimensions: (dim: { width: number; height: number }) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  applyStyleToAll: () => void;
  applyTemplate: (templateId: string) => void;
  duplicateActiveScreenshot: () => void;
  templates: ScreenshotTemplate[];
  isTemplatesOpen: boolean;
  setIsTemplatesOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  guideSettings: GuideSettings;
  setGuideSettings: (settings: GuideSettings) => void;
  toggleGuideSetting: (key: keyof GuideSettings) => void;
  exportScope: ExportScope;
  setExportScope: (scope: ExportScope) => void;
  canvasZoom: CanvasZoom;
  setCanvasZoom: (zoom: CanvasZoom) => void;
  customGradientPresets: GradientPreset[];
  saveCustomGradientPreset: (preset: GradientPreset) => void;
  updateScreenshotLabel: (screenshotId: string, label: string) => void;
  toggleScreenshotExport: (screenshotId: string) => void;
  navigateScreenshot: (direction: "prev" | "next" | number) => void;
  toggleLayerHidden: (entry: LayerEntry) => void;
  toggleLayerLocked: (entry: LayerEntry) => void;
  assignDeviceScreenshot: (
    screenshotId: string,
    deviceId: string,
    src: string,
  ) => void;

  // Refs
  previewRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  overlayImageInputRef: React.RefObject<HTMLInputElement | null>;

  // Derived
  selectedDevice: DeviceSpec;
  selectedColor: DeviceColor;
  activeScreenshot: Screenshot;
  activeDevice: DeviceInstance | null;
  exportSize: ExportSize;

  // Actions
  updateActiveScreenshot: (updates: Partial<Screenshot>) => void;
  addScreenshot: () => void;
  removeScreenshot: (id: string) => void;
  handleElementMouseDown: (
    e: React.MouseEvent,
    type: "headline" | "subheadline" | "image" | "device",
    screenshotId: string,
    id?: string,
  ) => void;
  handleElementMouseMove: (e: MouseEvent) => void;
  handleElementMouseUp: () => void;
  addOverlayImage: (
    file: File,
    options?: { screenshotId?: string; x?: number; y?: number },
  ) => void;
  addOverlayImages: (
    files: File[],
    options?: { screenshotId?: string; x?: number; y?: number },
  ) => void;
  removeOverlayImage: (imageId: string) => void;
  updateOverlayImageSize: (imageId: string, widthPercent: number) => void;
  updateOverlayImageLayer: (imageId: string, layer: "behind" | "front") => void;
  updateOverlayImageRotation: (imageId: string, rotation: number) => void;
  alignSelected: (mode: AlignMode) => void;
  distributeElements: (mode: DistributeMode) => void;
  applySnapPresetToActive: (preset: SnapPreset) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  toggleOverlayLayer: (imageId: string) => void;
  saveProjectFile: () => Promise<void>;
  updateOverlayImageShadow: (
    imageId: string,
    shadow: Partial<ShadowConfig>,
  ) => void;
  addDevice: () => void;
  selectDevice: (deviceId: string) => void;
  removeDevice: (deviceId: string) => void;
  bringDeviceForward: (deviceId: string) => void;
  sendDeviceBackward: (deviceId: string) => void;
  bringImageForward: (imageId: string) => void;
  sendImageBackward: (imageId: string) => void;
  bringImageToFront: (imageId: string) => void;
  sendImageToBack: (imageId: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  importProjectFile: (file: File) => Promise<void>;
  getBackgroundStyle: (screenshot: Screenshot) => string;
  resetEditor: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

type LegacyScreenshotFields = {
  screenshotSrc?: string | null;
  deviceScale?: number;
  deviceOffsetY?: number;
  deviceRotation?: number;
  deviceShadow?: ShadowConfig;
  deviceStyle?: "flat" | "3d";
  device3dRotateY?: number;
  device3dRotateX?: number;
};

// Default screenshot for new editors
const createDefaultScreenshot = (
  defaultDeviceId: string = devices[0].id,
  defaultColorId: string = devices[0].colors[0].id,
): Screenshot => {
  const defaultDevice = createDeviceInstance({
    deviceId: defaultDeviceId,
    colorId: defaultColorId,
  });

  return {
    id: generateId(),
    headline: "Showcase Your App",
    subheadline:
      "Create stunning App Store screenshots in minutes. Customizable templates, devices, and backgrounds.",
    backgroundColor: "#8b5cf6",
    backgroundMode: "solid",
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
    devices: [defaultDevice],
    activeDeviceId: defaultDevice.id,
  };
};

const normalizeScreenshot = (
  screenshot: Partial<Screenshot> & LegacyScreenshotFields,
  fallbackDeviceId: string,
  fallbackColorId: string,
): Screenshot => {
  const {
    screenshotSrc: _legacyScreenshotSrc,
    deviceScale: _legacyDeviceScale,
    deviceOffsetY: _legacyDeviceOffsetY,
    deviceRotation: _legacyDeviceRotation,
    deviceShadow: _legacyDeviceShadow,
    deviceStyle: _legacyDeviceStyle,
    device3dRotateY: _legacyDevice3dRotateY,
    device3dRotateX: _legacyDevice3dRotateX,
    ...rest
  } = screenshot;
  const baseScreenshot = createDefaultScreenshot(fallbackDeviceId, fallbackColorId);
  const { devices: deviceInstances, activeDeviceId } = ensureDeviceInstances(
    screenshot,
    fallbackDeviceId,
    fallbackColorId,
  );

  return {
    ...baseScreenshot,
    ...rest,
    overlayImages: screenshot.overlayImages ?? [],
    devices: deviceInstances,
    activeDeviceId,
  };
};

const normalizeProject = (project: Project): Project => {
  const fallbackDeviceId = project.selectedDeviceId ?? devices[0].id;
  const fallbackColorId =
    project.selectedColorId ?? getDeviceSpecById(fallbackDeviceId).colors[0].id;
  const normalizedScreenshots = project.screenshots.map((screenshot) =>
    normalizeScreenshot(screenshot, fallbackDeviceId, fallbackColorId),
  );

  return {
    ...project,
    selectedDeviceId: fallbackDeviceId,
    selectedColorId: fallbackColorId,
    exportSizeId: migrateExportSizeId(project.exportSizeId),
    exportQuality: migrateExportQuality(
      project.exportSizeId,
      project.exportQuality,
    ),
    screenshots: normalizedScreenshots,
    activeScreenshotId:
      normalizedScreenshots.find((s) => s.id === project.activeScreenshotId)?.id ??
      normalizedScreenshots[0].id,
  };
};

// Create a default project
const createDefaultProject = (name: string = "My Project"): Project => {
  const defaultDeviceId = devices[0].id;
  const defaultColorId = devices[0].colors[0].id;
  const defaultScreenshot = createDefaultScreenshot(defaultDeviceId, defaultColorId);
  return {
    id: generateId(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    screenshots: [defaultScreenshot],
    selectedDeviceId: defaultDeviceId,
    selectedColorId: defaultColorId,
    exportSizeId: exportSizes[0].id,
    exportQuality: 1,
    activeScreenshotId: defaultScreenshot.id,
    headlineFontSize: 72,
    subheadlineFontSize: 42,
  };
};

// Load persisted state once on module load
const persistedState = loadPersistedState();

// Initialize projects from persisted state or create default
const getInitialProjects = (): Project[] => {
  if (persistedState?.projects && persistedState.projects.length > 0) {
    return persistedState.projects.map(normalizeProject);
  }
  return [createDefaultProject()];
};

const getInitialActiveProjectId = (projects: Project[]): string => {
  if (persistedState?.activeProjectId) {
    // Verify the project exists
    const exists = projects.some((p) => p.id === persistedState.activeProjectId);
    if (exists) return persistedState.activeProjectId;
  }
  return projects[0]?.id || generateId();
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // Project state
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [activeProjectId, setActiveProjectId] = useState(() =>
    getInitialActiveProjectId(projects),
  );

  // Get active project
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  // Initialize state from persisted values or defaults
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(createInitialExportProgress);
  const isExporting = exportProgress.status === "running";
  const [selectedDeviceId, setSelectedDeviceIdState] = useState(
    activeProject.selectedDeviceId,
  );
  const [selectedColorId, setSelectedColorIdState] = useState(
    activeProject.selectedColorId,
  );
  const [exportSizeId, setExportSizeIdState] = useState(
    activeProject.exportSizeId,
  );
  const [exportQuality, setExportQualityState] = useState<ExportQuality>(
    activeProject.exportQuality ?? 2,
  );
  const [screenshots, setScreenshotsState] = useState<Screenshot[]>(
    activeProject.screenshots,
  );
  const [activeScreenshotId, setActiveScreenshotIdState] = useState(
    activeProject.activeScreenshotId,
  );
  const [headlineFontSize, setHeadlineFontSizeState] = useState(
    activeProject.headlineFontSize,
  );
  const [subheadlineFontSize, setSubheadlineFontSizeState] = useState(
    activeProject.subheadlineFontSize,
  );
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [guideSettings, setGuideSettingsState] = useState(loadGuideSettings);
  const [exportScope, setExportScopeState] = useState<ExportScope>("all");
  const [canvasZoom, setCanvasZoomState] = useState<CanvasZoom>(1);
  const setExportScope = useCallback((scope: ExportScope) => {
    setExportScopeState(scope);
  }, []);
  const setCanvasZoom = useCallback((zoom: CanvasZoom) => {
    setCanvasZoomState(zoom);
  }, []);

  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(
    null,
  );

  const historyRef = useRef<{
    past: Screenshot[][];
    future: Screenshot[][];
  }>({ past: [], future: [] });
  const [historyTick, setHistoryTick] = useState(0);
  const isRestoringHistory = useRef(false);
  const dragSnapshotPushed = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartElementPos = useRef({ x: 0, y: 0 });
  const dragContainerSize = useRef({ width: 0, height: 0 });
  const rafId = useRef<number | null>(null);
  const pendingUpdate = useRef<{ x: number; y: number } | null>(null);

  const overlayImageInputRef = useRef<HTMLInputElement>(null);

  const [previewDimensions, setPreviewDimensionsState] = useState({
    width: 0,
    height: 0,
  });

  const setPreviewDimensions = useCallback(
    (dimensions: { width: number; height: number }) => {
      setPreviewDimensionsState((prev) =>
        prev.width === dimensions.width && prev.height === dimensions.height
          ? prev
          : dimensions,
      );
    },
    [],
  );

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Sync project state when local state changes
  const updateProjectState = useCallback(() => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              screenshots,
              selectedDeviceId,
              selectedColorId,
              exportSizeId,
              exportQuality,
              activeScreenshotId,
              headlineFontSize,
              subheadlineFontSize,
              updatedAt: Date.now(),
            }
          : p,
      ),
    );
  }, [
    activeProjectId,
    screenshots,
    selectedDeviceId,
    selectedColorId,
    exportSizeId,
    exportQuality,
    activeScreenshotId,
    headlineFontSize,
    subheadlineFontSize,
  ]);

  // Update project whenever state changes
  useEffect(() => {
    updateProjectState();
  }, [updateProjectState]);

  // Auto-save projects to localStorage
  useEditorPersistence({
    projects,
    activeProjectId,
  });

  // Wrapper functions that update both local state and project
  const setSelectedDeviceId = (id: string) => {
    setSelectedDeviceIdState(id);
    const nextColorId = getDeviceColorById(id, selectedColorId).id;
    setSelectedColorIdState(nextColorId);
    commitScreenshots((prev) =>
      prev.map((screenshot) =>
        screenshot.id === activeScreenshotId
          ? {
              ...screenshot,
              devices: screenshot.devices.map((device) =>
                device.id === screenshot.activeDeviceId
                  ? { ...device, deviceId: id, colorId: nextColorId }
                  : device,
              ),
            }
          : screenshot,
      ),
    );
  };
  const setSelectedColorId = (id: string) => {
    setSelectedColorIdState(id);
    commitScreenshots((prev) =>
      prev.map((screenshot) =>
        screenshot.id === activeScreenshotId
          ? {
              ...screenshot,
              devices: screenshot.devices.map((device) =>
                device.id === screenshot.activeDeviceId
                  ? { ...device, colorId: id }
                  : device,
              ),
            }
          : screenshot,
      ),
    );
  };
  const pushHistory = useCallback((snapshot: Screenshot[]) => {
    if (isRestoringHistory.current) return;
    historyRef.current.past.push(
      structuredClone(snapshot) as Screenshot[],
    );
    if (historyRef.current.past.length > 50) {
      historyRef.current.past.shift();
    }
    historyRef.current.future = [];
    setHistoryTick((tick) => tick + 1);
  }, []);

  const commitScreenshots = useCallback(
    (
      next:
        | Screenshot[]
        | ((prev: Screenshot[]) => Screenshot[]),
      options?: { recordHistory?: boolean },
    ) => {
      setScreenshotsState((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        if (options?.recordHistory !== false) {
          pushHistory(prev);
        }
        return resolved;
      });
    },
    [pushHistory],
  );

  const setExportSizeId = useCallback((id: string) => {
    setExportSizeIdState(id);
    const exportSize = getExportSizeById(id);
    if (exportSize.appStore) {
      setExportQualityState(1);
    }
  }, []);

  const setExportQuality = useCallback((quality: ExportQuality) => {
    setExportQualityState(quality);
  }, []);
  const setScreenshots = (newScreenshots: Screenshot[]) => {
    commitScreenshots(newScreenshots);
  };
  const setActiveScreenshotId = (id: string) => {
    setActiveScreenshotIdState(id);
  };
  const setHeadlineFontSize = (size: number) => {
    setHeadlineFontSizeState(size);
  };
  const setSubheadlineFontSize = (size: number) => {
    setSubheadlineFontSizeState(size);
  };

  // Project management functions
  const createProject = (name: string) => {
    const newProject = createDefaultProject(name);
    setProjects((prev) => [...prev, newProject]);
    switchProject(newProject.id);
  };

  const renameProject = (id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      ),
    );
  };

  const deleteProject = (id: string) => {
    // Don't delete the last project
    if (projects.length <= 1) return;

    setProjects((prev) => prev.filter((p) => p.id !== id));

    // If deleting active project, switch to another
    if (id === activeProjectId) {
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        switchProject(remaining[0].id);
      }
    }
  };

  const switchProject = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    setActiveProjectId(id);
    setSelectedDeviceIdState(project.selectedDeviceId);
    setSelectedColorIdState(project.selectedColorId);
    setExportSizeIdState(project.exportSizeId);
    setExportQualityState(project.exportQuality ?? 2);
    setScreenshotsState(project.screenshots);
    setActiveScreenshotIdState(project.activeScreenshotId);
    setHeadlineFontSizeState(project.headlineFontSize);
    setSubheadlineFontSizeState(project.subheadlineFontSize);
    setSelectedElement(null);
    historyRef.current = { past: [], future: [] };
    setHistoryTick((tick) => tick + 1);
  };

  const loadProjectIntoEditor = useCallback((project: Project) => {
    setActiveProjectId(project.id);
    setSelectedDeviceIdState(project.selectedDeviceId);
    setSelectedColorIdState(project.selectedColorId);
    setExportSizeIdState(project.exportSizeId);
    setExportQualityState(project.exportQuality ?? 2);
    setScreenshotsState(project.screenshots);
    setActiveScreenshotIdState(project.activeScreenshotId);
    setHeadlineFontSizeState(project.headlineFontSize);
    setSubheadlineFontSizeState(project.subheadlineFontSize);
    setSelectedElement(null);
    historyRef.current = { past: [], future: [] };
    setHistoryTick((tick) => tick + 1);
  }, []);

  const setGuideSettings = useCallback((settings: GuideSettings) => {
    setGuideSettingsState(settings);
    saveGuideSettings(settings);
  }, []);

  const toggleGuideSetting = useCallback((key: keyof GuideSettings) => {
    setGuideSettingsState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveGuideSettings(next);
      return next;
    });
  }, []);

  const importProjectFile = useCallback(async (file: File) => {
    const imported = normalizeProject(await readProjectFromFile(file));
    const importedProject: Project = {
      ...imported,
      id: generateId(),
      updatedAt: Date.now(),
    };

    setProjects((prev) => [...prev, importedProject]);
    loadProjectIntoEditor(importedProject);
  }, [loadProjectIntoEditor]);

  const customGradientPresets = activeProject.customGradientPresets ?? [];

  const saveProjectFile = useCallback(async () => {
    await downloadProjectFile({
      ...activeProject,
      screenshots,
      selectedDeviceId,
      selectedColorId,
      exportSizeId,
      exportQuality,
      activeScreenshotId,
      headlineFontSize,
      subheadlineFontSize,
      customGradientPresets,
      updatedAt: Date.now(),
    });
  }, [
    activeProject,
    activeScreenshotId,
    customGradientPresets,
    exportQuality,
    exportSizeId,
    headlineFontSize,
    screenshots,
    selectedColorId,
    selectedDeviceId,
    subheadlineFontSize,
  ]);

  const saveCustomGradientPreset = useCallback(
    (preset: GradientPreset) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === activeProjectId
            ? {
                ...project,
                customGradientPresets: [
                  ...(project.customGradientPresets ?? []),
                  preset,
                ],
                updatedAt: Date.now(),
              }
            : project,
        ),
      );
    },
    [activeProjectId],
  );

  const navigateScreenshot = useCallback(
    (direction: "prev" | "next" | number) => {
      const index = screenshots.findIndex(
        (item) => item.id === activeScreenshotId,
      );
      if (index === -1) return;

      if (typeof direction === "number") {
        const target = screenshots[direction];
        if (target) {
          setActiveScreenshotIdState(target.id);
          setSelectedElement(null);
        }
        return;
      }

      const nextIndex =
        direction === "next"
          ? Math.min(screenshots.length - 1, index + 1)
          : Math.max(0, index - 1);
      setActiveScreenshotIdState(screenshots[nextIndex].id);
      setSelectedElement(null);
    },
    [activeScreenshotId, screenshots],
  );

  const selectedDevice =
    getDeviceSpecById(selectedDeviceId);
  const selectedColor =
    getDeviceColorById(selectedDevice.id, selectedColorId);
  const activeScreenshot =
    screenshots.find((s) => s.id === activeScreenshotId) || screenshots[0];
  const activeDevice =
    activeScreenshot.devices.find(
      (device) => device.id === activeScreenshot.activeDeviceId,
    ) ?? activeScreenshot.devices[0] ?? null;
  const exportSize = getExportSizeById(exportSizeId);

  const updateScreenshotById = useCallback(
    (
      screenshotId: string,
      updates: Partial<Screenshot>,
      options?: { recordHistory?: boolean },
    ) => {
      commitScreenshots(
        (prev) =>
          prev.map((s) => (s.id === screenshotId ? { ...s, ...updates } : s)),
        options,
      );
    },
    [commitScreenshots],
  );

  const updateActiveScreenshot = useCallback(
    (updates: Partial<Screenshot>, options?: { recordHistory?: boolean }) => {
      updateScreenshotById(activeScreenshotId, updates, options);
    },
    [activeScreenshotId, updateScreenshotById],
  );

  const updateScreenshotLabel = useCallback(
    (screenshotId: string, label: string) => {
      updateScreenshotById(screenshotId, { label: label.trim() || undefined });
    },
    [updateScreenshotById],
  );

  const toggleScreenshotExport = useCallback(
    (screenshotId: string) => {
      const target = screenshots.find((item) => item.id === screenshotId);
      if (!target) return;
      updateScreenshotById(screenshotId, {
        includeInExport: target.includeInExport === false,
      });
    },
    [screenshots, updateScreenshotById],
  );

  const toggleLayerHidden = useCallback(
    (entry: LayerEntry) => {
      const updates = toggleLayerVisibility(activeScreenshot, entry);
      updateActiveScreenshot(updates);
    },
    [activeScreenshot, updateActiveScreenshot],
  );

  const toggleLayerLocked = useCallback(
    (entry: LayerEntry) => {
      const updates = toggleLayerLock(activeScreenshot, entry);
      updateActiveScreenshot(updates);
    },
    [activeScreenshot, updateActiveScreenshot],
  );

  const assignDeviceScreenshot = useCallback(
    (screenshotId: string, deviceId: string, src: string) => {
      const target =
        screenshots.find((item) => item.id === screenshotId) ?? activeScreenshot;
      updateScreenshotById(screenshotId, {
        devices: target.devices.map((device) =>
          device.id === deviceId ? { ...device, screenshotSrc: src } : device,
        ),
        activeDeviceId: deviceId,
      });
      setActiveScreenshotIdState(screenshotId);
      setSelectedElement({ type: "device", id: deviceId, screenshotId });
    },
    [activeScreenshot, screenshots, updateScreenshotById],
  );

  const undo = useCallback(() => {
    const previous = historyRef.current.past.pop();
    if (!previous) return;
    historyRef.current.future.push(
      structuredClone(screenshots) as Screenshot[],
    );
    isRestoringHistory.current = true;
    setScreenshotsState(previous);
    isRestoringHistory.current = false;
    setHistoryTick((tick) => tick + 1);
  }, [screenshots]);

  const redo = useCallback(() => {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push(structuredClone(screenshots) as Screenshot[]);
    isRestoringHistory.current = true;
    setScreenshotsState(next);
    isRestoringHistory.current = false;
    setHistoryTick((tick) => tick + 1);
  }, [screenshots]);

  const applyStyleToAll = useCallback(() => {
    commitScreenshots((prev) => {
      const source =
        prev.find((screenshot) => screenshot.id === activeScreenshotId) ??
        prev[0];
      return applyStyleFromScreenshot(source, prev);
    });
  }, [activeScreenshotId, commitScreenshots]);

  const applyTemplate = useCallback(
    (templateId: string) => {
      const template = screenshotTemplates.find((item) => item.id === templateId);
      if (!template) return;
      const nextScreenshots = applyScreenshotTemplate(
        template,
        selectedDeviceId,
        selectedColorId,
      );
      commitScreenshots(nextScreenshots);
      setActiveScreenshotIdState(nextScreenshots[0].id);
      setIsTemplatesOpen(false);
    },
    [commitScreenshots, selectedColorId, selectedDeviceId],
  );

  const duplicateActiveScreenshot = useCallback(() => {
    const source =
      screenshots.find((screenshot) => screenshot.id === activeScreenshotId) ??
      screenshots[0];
    const devices = source.devices.map((device) =>
      cloneDeviceInstance(device, { id: generateId() }),
    );
    const duplicate: Screenshot = {
      ...structuredClone(source),
      id: generateId(),
      devices,
      activeDeviceId: devices[0].id,
      overlayImages: source.overlayImages.map((image) => ({
        ...image,
        id: generateId(),
      })),
    };
    const index = screenshots.findIndex(
      (screenshot) => screenshot.id === activeScreenshotId,
    );
    const next = [...screenshots];
    next.splice(index + 1, 0, duplicate);
    commitScreenshots(next);
    setActiveScreenshotIdState(duplicate.id);
  }, [activeScreenshotId, commitScreenshots, screenshots]);

  useEffect(() => {
    if (!activeDevice) return;
    if (selectedDeviceId !== activeDevice.deviceId) {
      setSelectedDeviceIdState(activeDevice.deviceId);
    }
    if (selectedColorId !== activeDevice.colorId) {
      setSelectedColorIdState(activeDevice.colorId);
    }
    if (activeScreenshot.activeDeviceId !== activeDevice.id) {
      updateActiveScreenshot({ activeDeviceId: activeDevice.id });
    }
  }, [
    activeDevice,
    activeScreenshot.activeDeviceId,
    selectedColorId,
    selectedDeviceId,
    updateActiveScreenshot,
  ]);

  const addScreenshot = () => {
    const newScreenshot: Screenshot = {
      id: generateId(),
      headline: "New Screenshot",
      subheadline: "Add your description here",
      backgroundColor: activeScreenshot.backgroundColor,
      backgroundMode: activeScreenshot.backgroundMode,
      gradientPresetId: activeScreenshot.gradientPresetId,
      textColor: activeScreenshot.textColor,
      headlineX: 50,
      headlineY: 10,
      headlineWidth: 80,
      subheadlineX: 50,
      subheadlineY: 18,
      subheadlineWidth: 80,
      fontFamily: activeScreenshot.fontFamily,
      overlayImages: [],
      devices: activeScreenshot.devices.map((device) =>
        cloneDeviceInstance(device, { id: generateId() }),
      ),
      activeDeviceId: activeScreenshot.devices[0]?.id ?? "",
    };
    newScreenshot.activeDeviceId = newScreenshot.devices[0]?.id ?? "";
    setScreenshots([...screenshots, newScreenshot]);
    setActiveScreenshotId(newScreenshot.id);
  };

  const handleElementMouseDown = (
    e: React.MouseEvent,
    type: "headline" | "subheadline" | "image" | "device",
    screenshotId: string,
    id?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const screenshotElement = (e.currentTarget as HTMLElement).closest(
      "[data-screenshot-card='true']",
    );
    if (screenshotElement instanceof HTMLElement) {
      const rect = screenshotElement.getBoundingClientRect();
      dragContainerSize.current = { width: rect.width, height: rect.height };
    } else if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      dragContainerSize.current = { width: rect.width, height: rect.height };
    }

    const targetScreenshot =
      screenshots.find((screenshot) => screenshot.id === screenshotId) ??
      activeScreenshot;

    const nextSelection: SelectedElement = { type, id, screenshotId };
    if (isSelectedElementLocked(targetScreenshot, nextSelection)) {
      setSelectedElement(nextSelection);
      if (activeScreenshotId !== screenshotId) {
        setActiveScreenshotIdState(screenshotId);
      }
      return;
    }

    setIsDragging(true);
    setSnapGuides([]);
    dragSnapshotPushed.current = false;
    setSelectedElement({ type, id, screenshotId });
    if (activeScreenshotId !== screenshotId) {
      setActiveScreenshotIdState(screenshotId);
    }
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    if (type === "device" && id) {
      updateScreenshotById(screenshotId, { activeDeviceId: id }, { recordHistory: false });
      const device = targetScreenshot.devices.find((item) => item.id === id);
      if (device) {
        dragStartElementPos.current = { x: device.x, y: device.y };
      }
    } else if (type === "headline") {
      dragStartElementPos.current = {
        x: targetScreenshot.headlineX,
        y: targetScreenshot.headlineY,
      };
    } else if (type === "subheadline") {
      dragStartElementPos.current = {
        x: targetScreenshot.subheadlineX,
        y: targetScreenshot.subheadlineY,
      };
    } else if (type === "image" && id) {
      const image = targetScreenshot.overlayImages.find((img) => img.id === id);
      if (image) {
        dragStartElementPos.current = { x: image.x, y: image.y };
      }
    }
  };

  const applyDragUpdate = useCallback(() => {
    if (!pendingUpdate.current || !selectedElement) return;

    const { x: newX, y: newY } = pendingUpdate.current;

    if (!dragSnapshotPushed.current) {
      pushHistory(screenshots);
      dragSnapshotPushed.current = true;
    }

    if (selectedElement.type === "headline") {
      updateScreenshotById(
        selectedElement.screenshotId,
        {
          headlineX: newX,
          headlineY: newY,
        },
        { recordHistory: false },
      );
    } else if (selectedElement.type === "subheadline") {
      updateScreenshotById(
        selectedElement.screenshotId,
        {
          subheadlineX: newX,
          subheadlineY: newY,
        },
        { recordHistory: false },
      );
    } else if (selectedElement.type === "image" && selectedElement.id) {
      const targetScreenshot = screenshots.find(
        (screenshot) => screenshot.id === selectedElement.screenshotId,
      );
      if (!targetScreenshot) return;

      const updatedImages = targetScreenshot.overlayImages.map((img) =>
        img.id === selectedElement.id ? { ...img, x: newX, y: newY } : img,
      );
      updateScreenshotById(
        selectedElement.screenshotId,
        {
          overlayImages: updatedImages,
        },
        { recordHistory: false },
      );
    } else if (selectedElement.type === "device" && selectedElement.id) {
      const targetScreenshot = screenshots.find(
        (screenshot) => screenshot.id === selectedElement.screenshotId,
      );
      if (!targetScreenshot) return;

      const updatedDevices = targetScreenshot.devices.map((device) =>
        device.id === selectedElement.id ? { ...device, x: newX, y: newY } : device,
      );
      updateScreenshotById(
        selectedElement.screenshotId,
        {
          devices: updatedDevices,
        },
        { recordHistory: false },
      );
    }

    pendingUpdate.current = null;
    rafId.current = null;
  }, [pushHistory, screenshots, selectedElement, updateScreenshotById]);

  const handleElementMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedElement) return;

      const { width, height } = dragContainerSize.current;
      if (width === 0 || height === 0) return;

      const deltaX = ((e.clientX - dragStartPos.current.x) / width) * 100;
      const deltaY = ((e.clientY - dragStartPos.current.y) / height) * 100;

      const rawX = dragStartElementPos.current.x + deltaX;
      const rawY = dragStartElementPos.current.y + deltaY;

      const targetScreenshot =
        screenshots.find(
          (screenshot) => screenshot.id === selectedElement.screenshotId,
        ) ?? activeScreenshot;

      const thresholds = getSnapThresholdPercent(width, height);
      const threshold = Math.max(thresholds.x, thresholds.y);
      const { x: newX, y: newY, guides } = snapDragPosition(
        rawX,
        rawY,
        collectAlignmentTargets(targetScreenshot, {
          type: selectedElement.type,
          id: selectedElement.id,
        }),
        threshold,
      );

      setSnapGuides(guides);
      pendingUpdate.current = { x: newX, y: newY };

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(applyDragUpdate);
      }
    },
    [activeScreenshot, applyDragUpdate, isDragging, screenshots, selectedElement],
  );

  const handleElementMouseUp = useCallback(() => {
    setIsDragging(false);
    setSnapGuides([]);
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (pendingUpdate.current) {
      applyDragUpdate();
    }
  }, [applyDragUpdate]);

  // Set up global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleElementMouseMove);
      window.addEventListener("mouseup", handleElementMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleElementMouseMove);
      window.removeEventListener("mouseup", handleElementMouseUp);
    };
  }, [isDragging, handleElementMouseMove, handleElementMouseUp]);

  const addOverlayImages = useCallback(
    async (
      files: File[],
      options?: { screenshotId?: string; x?: number; y?: number },
    ) => {
      const imageFiles = filterImageFiles(files);
      if (imageFiles.length === 0) return;

      const targetScreenshotId = options?.screenshotId ?? activeScreenshotId;
      const targetScreenshot =
        screenshots.find((screenshot) => screenshot.id === targetScreenshotId) ??
        activeScreenshot;

      const newOverlays: ImageOverlay[] = [];

      for (const [index, file] of imageFiles.entries()) {
        try {
          const { src, width, height } = await readImageFile(file);
          const baseX = options?.x ?? 50;
          const baseY = options?.y ?? 50;
          newOverlays.push(
            createOverlayFromImage(src, width, height, {
              x: Math.min(92, baseX + index * 4),
              y: Math.min(92, baseY + index * 4),
            }),
          );
        } catch {
          continue;
        }
      }

      if (newOverlays.length === 0) return;

      updateScreenshotById(targetScreenshotId, {
        overlayImages: [...targetScreenshot.overlayImages, ...newOverlays],
      });

      const lastOverlay = newOverlays[newOverlays.length - 1];
      if (targetScreenshotId !== activeScreenshotId) {
        setActiveScreenshotId(targetScreenshotId);
      }
      setSelectedElement({
        type: "image",
        id: lastOverlay.id,
        screenshotId: targetScreenshotId,
      });
    },
    [
      activeScreenshot,
      activeScreenshotId,
      screenshots,
      updateScreenshotById,
    ],
  );

  const addOverlayImage = useCallback(
    (
      file: File,
      options?: { screenshotId?: string; x?: number; y?: number },
    ) => {
      void addOverlayImages([file], options);
    },
    [addOverlayImages],
  );

  const removeOverlayImage = (imageId: string) => {
    const updatedImages = activeScreenshot.overlayImages.filter(
      (img) => img.id !== imageId,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
    if (
      selectedElement?.type === "image" &&
      selectedElement.screenshotId === activeScreenshot.id &&
      selectedElement.id === imageId
    ) {
      setSelectedElement(null);
    }
  };

  const updateOverlayImageSize = (imageId: string, widthPercent: number) => {
    const image = activeScreenshot.overlayImages.find(
      (img) => img.id === imageId,
    );
    if (!image) return;

    // Use current dimensions to maintain aspect ratio without reloading image
    const aspectRatio = image.width / image.height;

    const updatedImages = activeScreenshot.overlayImages.map((item) =>
      item.id === imageId
        ? {
            ...item,
            width: widthPercent,
            height: widthPercent / aspectRatio,
          }
        : item,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
  };

  const updateOverlayImageLayer = (
    imageId: string,
    layer: "behind" | "front",
  ) => {
    const updatedImages = activeScreenshot.overlayImages.map((item) =>
      item.id === imageId ? { ...item, layer } : item,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
  };

  const updateOverlayImageRotation = (imageId: string, rotation: number) => {
    const snapped = snapAngle(rotation, OVERLAY_ROTATION_SNAP);
    const updatedImages = activeScreenshot.overlayImages.map((item) =>
      item.id === imageId ? { ...item, rotation: snapped } : item,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
  };

  const alignSelected = useCallback(
    (mode: AlignMode) => {
      if (!selectedElement) return;

      const targetScreenshot =
        screenshots.find(
          (screenshot) => screenshot.id === selectedElement.screenshotId,
        ) ?? activeScreenshot;

      const updates = getAlignUpdates(
        selectedElement,
        targetScreenshot,
        mode,
        exportSize,
        getDeviceSpecById,
      );

      if (updates) {
        updateScreenshotById(selectedElement.screenshotId, updates);
      }
    },
    [
      activeScreenshot,
      exportSize,
      screenshots,
      selectedElement,
      updateScreenshotById,
    ],
  );

  const distributeElements = useCallback(
    (mode: DistributeMode) => {
      const updates = distributeScreenshotElements(activeScreenshot, mode);
      if (updates) {
        updateActiveScreenshot(updates);
      }
    },
    [activeScreenshot, updateActiveScreenshot],
  );

  const applySnapPresetToActive = useCallback(
    (preset: SnapPreset) => {
      const updates = applySnapPreset(
        activeScreenshot,
        preset,
        exportSize,
        getDeviceSpecById,
      );
      if (updates) {
        updateActiveScreenshot(updates);
      }
    },
    [activeScreenshot, exportSize, updateActiveScreenshot],
  );

  const reorderScreenshots = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= screenshots.length ||
        toIndex >= screenshots.length
      ) {
        return;
      }
      commitScreenshots((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [commitScreenshots, screenshots.length],
  );

  const reorderLayers = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updates = reorderLayerStack(activeScreenshot, fromIndex, toIndex);
      if (updates) {
        updateActiveScreenshot(updates);
      }
    },
    [activeScreenshot, updateActiveScreenshot],
  );

  const toggleOverlayLayer = useCallback(
    (imageId: string) => {
      const image = activeScreenshot.overlayImages.find(
        (item) => item.id === imageId,
      );
      if (!image) return;
      const nextLayer = image.layer === "behind" ? "front" : "behind";
      const updates = setOverlayLayer(activeScreenshot, imageId, nextLayer);
      if (Object.keys(updates).length > 0) {
        updateActiveScreenshot(updates);
      }
    },
    [activeScreenshot, updateActiveScreenshot],
  );

  const updateOverlayImageShadow = (
    imageId: string,
    shadow: Partial<ShadowConfig>,
  ) => {
    const updatedImages = activeScreenshot.overlayImages.map((item) =>
      item.id === imageId
        ? { ...item, shadow: { ...item.shadow, ...shadow } }
        : item,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
  };

  const bringImageForward = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index !== -1 && index < images.length - 1) {
      const temp = images[index];
      images[index] = images[index + 1];
      images[index + 1] = temp;
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const sendImageBackward = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index > 0) {
      const temp = images[index];
      images[index] = images[index - 1];
      images[index - 1] = temp;
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const bringImageToFront = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index !== -1 && index < images.length - 1) {
      const [image] = images.splice(index, 1);
      images.push(image);
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const sendImageToBack = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index > 0) {
      const [image] = images.splice(index, 1);
      images.unshift(image);
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const addDevice = () => {
    const nextDevice = activeDevice
      ? cloneDeviceInstance(activeDevice, {
          id: generateId(),
          x: Math.min(activeDevice.x + 12, 88),
          y: Math.min(activeDevice.y + 4, 70),
        })
      : createDeviceInstance({
          deviceId: selectedDeviceId,
          colorId: selectedColorId,
        });

    updateActiveScreenshot({
      devices: [...activeScreenshot.devices, nextDevice],
      activeDeviceId: nextDevice.id,
    });
    setSelectedElement({
      type: "device",
      id: nextDevice.id,
      screenshotId: activeScreenshot.id,
    });
    setSelectedDeviceIdState(nextDevice.deviceId);
    setSelectedColorIdState(nextDevice.colorId);
  };

  const selectDevice = (deviceId: string) => {
    updateActiveScreenshot({ activeDeviceId: deviceId });
    setSelectedElement({
      type: "device",
      id: deviceId,
      screenshotId: activeScreenshot.id,
    });
  };

  const removeDevice = (deviceId: string) => {
    const nextDevices = activeScreenshot.devices.filter(
      (device) => device.id !== deviceId,
    );
    const nextActiveDeviceId =
      activeScreenshot.activeDeviceId === deviceId
        ? (nextDevices[nextDevices.length - 1]?.id ?? "")
        : activeScreenshot.activeDeviceId;

    updateActiveScreenshot({
      devices: nextDevices,
      activeDeviceId: nextActiveDeviceId,
    });

    if (
      selectedElement?.type === "device" &&
      selectedElement.screenshotId === activeScreenshot.id &&
      selectedElement.id === deviceId
    ) {
      if (nextActiveDeviceId) {
        setSelectedElement({
          type: "device",
          id: nextActiveDeviceId,
          screenshotId: activeScreenshot.id,
        });
      } else {
        setSelectedElement(null);
      }
    }
  };

  const bringDeviceForward = (deviceId: string) => {
    const nextDevices = [...activeScreenshot.devices];
    const index = nextDevices.findIndex((device) => device.id === deviceId);
    if (index !== -1 && index < nextDevices.length - 1) {
      const temp = nextDevices[index];
      nextDevices[index] = nextDevices[index + 1];
      nextDevices[index + 1] = temp;
      updateActiveScreenshot({ devices: nextDevices });
    }
  };

  const sendDeviceBackward = (deviceId: string) => {
    const nextDevices = [...activeScreenshot.devices];
    const index = nextDevices.findIndex((device) => device.id === deviceId);
    if (index > 0) {
      const temp = nextDevices[index];
      nextDevices[index] = nextDevices[index - 1];
      nextDevices[index - 1] = temp;
      updateActiveScreenshot({ devices: nextDevices });
    }
  };

  const removeScreenshot = (id: string) => {
    if (screenshots.length <= 1) return;
    const newScreenshots = screenshots.filter((s) => s.id !== id);
    setScreenshots(newScreenshots);
    if (activeScreenshotId === id) {
      setActiveScreenshotId(newScreenshots[0].id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeDevice) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        updateActiveScreenshot({
          devices: activeScreenshot.devices.map((device) =>
            device.id === activeDevice.id
              ? { ...device, screenshotSrc: result }
              : device,
          ),
        });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const getBackgroundStyle = (screenshot: Screenshot) =>
    getScreenshotBackgroundStyle(screenshot, customGradientPresets);

  const handleExport = useCallback(async () => {
    if (isExporting) return;

    const exportScreenshots = getExportScreenshots(
      screenshots,
      exportScope,
      activeScreenshotId,
    );

    if (exportScreenshots.length === 0) {
      window.alert("No screenshots selected for export.");
      return;
    }

    const outputWidth = getOutputDimensions(exportSize, exportQuality).width;
    const outputHeight = getOutputDimensions(exportSize, exportQuality).height;
    const qualityLabel =
      exportQualityOptions.find((option) => option.id === exportQuality)?.label ??
      `${exportQuality}x`;
    const startTime = Date.now();

    setExportProgress({
      isOpen: true,
      status: "running",
      progress: 0,
      phase: "Starting export",
      detail: "Spinning up the high-resolution render pipeline…",
      screenshotIndex: 0,
      screenshotTotal: exportScreenshots.length,
      outputWidth,
      outputHeight,
      qualityLabel,
      exportLabel: exportSize.label,
    });

    try {
      const files = await renderExportFiles({
        screenshots: exportScreenshots,
        exportSize,
        exportQuality,
        previewDimensions,
        headlineFontSize,
        subheadlineFontSize,
        customGradientPresets,
        onProgress: (update) => {
          setExportProgress((current) => ({
            ...current,
            ...update,
            status: "running",
            outputWidth,
            outputHeight,
            qualityLabel,
            exportLabel: exportSize.label,
            screenshotTotal: exportScreenshots.length,
          }));
        },
      });

      await runPostRenderPhases(startTime, (update) => {
        setExportProgress((current) => ({
          ...current,
          ...update,
          status: "running",
        }));
      });

      const packagingDetail =
        files.length > 1
          ? `Bundling ${files.length} screenshots and ${getProjectFileName(activeProject.name)}…`
          : `Saving screenshot and ${getProjectFileName(activeProject.name)}…`;

      setExportProgress((current) => ({
        ...current,
        phase: "Delivering download",
        detail: packagingDetail,
        progress: 99,
      }));

      const packedProject = packProjectForExport({
        ...activeProject,
        screenshots,
        selectedDeviceId,
        selectedColorId,
        exportSizeId,
        exportQuality,
        activeScreenshotId,
        headlineFontSize,
        subheadlineFontSize,
        customGradientPresets,
        updatedAt: Date.now(),
      });

      await downloadExportFiles(files, {
        projectFile: {
          name: getProjectFileName(activeProject.name),
          content: packedProject.documentJson,
          assets: packedProject.assets,
        },
        archiveName: `${sanitizeProjectFilename(activeProject.name)}-export.zip`,
      });

      setExportProgress((current) => ({
        ...current,
        status: "complete",
        progress: 100,
        phase: "Export complete",
        detail: `${files.length} screenshot${files.length === 1 ? "" : "s"} exported with a .framelab project file.`,
      }));

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 900);
      });

      setExportProgress(createInitialExportProgress());
      setIsStarModalOpen(true);
    } catch {
      setExportProgress((current) => ({
        ...current,
        status: "error",
        phase: "Export failed",
        detail: "Something went wrong while rendering. Please try again.",
      }));

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 2200);
      });
      setExportProgress(createInitialExportProgress());
    }
  }, [
    activeProject,
    customGradientPresets,
    exportQuality,
    exportScope,
    exportSize,
    headlineFontSize,
    isExporting,
    previewDimensions,
    screenshots,
    selectedColorId,
    selectedDeviceId,
    subheadlineFontSize,
    activeScreenshotId,
  ]);

  const resetEditor = () => {
    clearPersistedState();
    const defaultProject = createDefaultProject();
    setProjects([defaultProject]);
    setActiveProjectId(defaultProject.id);
    setSelectedDeviceIdState(defaultProject.selectedDeviceId);
    setSelectedColorIdState(defaultProject.selectedColorId);
    setExportSizeIdState(defaultProject.exportSizeId);
    setExportQualityState(defaultProject.exportQuality);
    setScreenshotsState(defaultProject.screenshots);
    setActiveScreenshotIdState(defaultProject.activeScreenshotId);
    setHeadlineFontSizeState(defaultProject.headlineFontSize);
    setSubheadlineFontSizeState(defaultProject.subheadlineFontSize);
    setSelectedElement(null);
    setIsStarModalOpen(false);
    historyRef.current = { past: [], future: [] };
    setHistoryTick((tick) => tick + 1);
  };

  const snapGuideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable
      );
    };

    const showSnapGuides = (guides: SnapGuide[]) => {
      setSnapGuides(guides);
      if (snapGuideTimeoutRef.current !== null) {
        window.clearTimeout(snapGuideTimeoutRef.current);
      }
      snapGuideTimeoutRef.current = window.setTimeout(() => {
        setSnapGuides([]);
        snapGuideTimeoutRef.current = null;
      }, 700);
    };

    const snapNudgePosition = (
      screenshot: Screenshot,
      rawX: number,
      rawY: number,
    ) => {
      const { width, height } = previewDimensions;
      const thresholds = getSnapThresholdPercent(width, height);
      const threshold = Math.max(thresholds.x, thresholds.y);
      return snapDragPosition(
        rawX,
        rawY,
        collectAlignmentTargets(screenshot, {
          type: selectedElement!.type,
          id: selectedElement!.id,
        }),
        threshold,
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const meta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (meta && key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      if ((meta && key === "z" && event.shiftKey) || (meta && key === "y")) {
        event.preventDefault();
        redo();
        return;
      }

      if (meta && key === "d" && !event.shiftKey) {
        event.preventDefault();
        duplicateActiveScreenshot();
        return;
      }

      if (event.key === "?" && !meta) {
        event.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }

      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        navigateScreenshot("prev");
        return;
      }

      if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        navigateScreenshot("next");
        return;
      }

      if (
        !meta &&
        !event.altKey &&
        !event.shiftKey &&
        /^[1-9]$/.test(event.key)
      ) {
        const index = Number(event.key) - 1;
        if (index < screenshots.length) {
          event.preventDefault();
          navigateScreenshot(index);
        }
        return;
      }

      if (meta && event.shiftKey && selectedElement) {
        if (key === "h") {
          event.preventDefault();
          alignSelected("center-h");
          return;
        }
        if (key === "v") {
          event.preventDefault();
          alignSelected("center-v");
          return;
        }
        if (key === "m") {
          event.preventDefault();
          alignSelected("center");
          return;
        }
        if (key === "d") {
          event.preventDefault();
          alignSelected("to-device");
          return;
        }
      }

      if (
        (event.key === "[" || event.key === "]") &&
        selectedElement &&
        (selectedElement.type === "device" || selectedElement.type === "image")
      ) {
        event.preventDefault();
        const target =
          screenshots.find((s) => s.id === selectedElement.screenshotId) ??
          activeScreenshot;
        const direction = event.key === "[" ? -1 : 1;
        const updates = getRotationStepUpdate(
          selectedElement,
          target,
          direction,
        );
        if (updates) {
          updateScreenshotById(selectedElement.screenshotId, updates);
        }
        return;
      }

      if ((key === "delete" || key === "backspace") && selectedElement) {
        event.preventDefault();
        if (selectedElement.type === "image" && selectedElement.id) {
          removeOverlayImage(selectedElement.id);
        } else if (selectedElement.type === "device" && selectedElement.id) {
          removeDevice(selectedElement.id);
        }
        return;
      }

      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key) &&
        selectedElement
      ) {
        const target =
          screenshots.find((s) => s.id === selectedElement.screenshotId) ??
          activeScreenshot;
        if (isSelectedElementLocked(target, selectedElement)) return;

        event.preventDefault();
        const step = event.shiftKey ? 2 : 0.5;
        const dx =
          key === "arrowleft" ? -step : key === "arrowright" ? step : 0;
        const dy = key === "arrowup" ? -step : key === "arrowdown" ? step : 0;

        if (selectedElement.type === "headline") {
          const { x, y, guides } = snapNudgePosition(
            target,
            target.headlineX + dx,
            target.headlineY + dy,
          );
          showSnapGuides(guides);
          updateScreenshotById(selectedElement.screenshotId, {
            headlineX: x,
            headlineY: y,
          });
        } else if (selectedElement.type === "subheadline") {
          const { x, y, guides } = snapNudgePosition(
            target,
            target.subheadlineX + dx,
            target.subheadlineY + dy,
          );
          showSnapGuides(guides);
          updateScreenshotById(selectedElement.screenshotId, {
            subheadlineX: x,
            subheadlineY: y,
          });
        } else if (selectedElement.type === "device" && selectedElement.id) {
          const device = target.devices.find(
            (item) => item.id === selectedElement.id,
          );
          if (!device) return;
          const { x, y, guides } = snapNudgePosition(
            target,
            device.x + dx,
            device.y + dy,
          );
          showSnapGuides(guides);
          updateScreenshotById(selectedElement.screenshotId, {
            devices: target.devices.map((item) =>
              item.id === selectedElement.id ? { ...item, x, y } : item,
            ),
          });
        } else if (selectedElement.type === "image" && selectedElement.id) {
          const image = target.overlayImages.find(
            (item) => item.id === selectedElement.id,
          );
          if (!image) return;
          const { x, y, guides } = snapNudgePosition(
            target,
            image.x + dx,
            image.y + dy,
          );
          showSnapGuides(guides);
          updateScreenshotById(selectedElement.screenshotId, {
            overlayImages: target.overlayImages.map((item) =>
              item.id === selectedElement.id ? { ...item, x, y } : item,
            ),
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (snapGuideTimeoutRef.current !== null) {
        window.clearTimeout(snapGuideTimeoutRef.current);
      }
    };
  }, [
    activeScreenshot,
    alignSelected,
    duplicateActiveScreenshot,
    navigateScreenshot,
    previewDimensions,
    redo,
    removeDevice,
    removeOverlayImage,
    screenshots,
    selectedElement,
    undo,
    updateScreenshotById,
  ]);

  return (
    <EditorContext.Provider
      value={{
        // Project state
        projects,
        activeProjectId,
        activeProject,
        createProject,
        renameProject,
        deleteProject,
        switchProject,

        isFontPickerOpen,
        setIsFontPickerOpen,
        isStarModalOpen,
        setIsStarModalOpen,
        exportProgress,
        isExporting,
        selectedDeviceId,
        setSelectedDeviceId,
        selectedColorId,
        setSelectedColorId,
        exportSizeId,
        setExportSizeId,
        exportQuality,
        setExportQuality,
        screenshots,
        setScreenshots,
        activeScreenshotId,
        setActiveScreenshotId,
        selectedElement,
        setSelectedElement,
        isDragging,
        snapGuides,
        headlineFontSize,
        setHeadlineFontSize,
        subheadlineFontSize,
        setSubheadlineFontSize,
        previewDimensions,
        setPreviewDimensions,
        canUndo: historyTick >= 0 && historyRef.current.past.length > 0,
        canRedo: historyTick >= 0 && historyRef.current.future.length > 0,
        undo,
        redo,
        applyStyleToAll,
        applyTemplate,
        duplicateActiveScreenshot,
        templates: screenshotTemplates,
        isTemplatesOpen,
        setIsTemplatesOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        guideSettings,
        setGuideSettings,
        toggleGuideSetting,
        exportScope,
        setExportScope,
        canvasZoom,
        setCanvasZoom,
        customGradientPresets,
        saveCustomGradientPreset,
        updateScreenshotLabel,
        toggleScreenshotExport,
        navigateScreenshot,
        toggleLayerHidden,
        toggleLayerLocked,
        assignDeviceScreenshot,
        previewRef,
        fileInputRef,
        canvasContainerRef,
        overlayImageInputRef,
        selectedDevice,
        selectedColor,
        activeScreenshot,
        activeDevice,
        exportSize,
        updateActiveScreenshot,
        addScreenshot,
        removeScreenshot,
        handleElementMouseDown,
        handleElementMouseMove,
        handleElementMouseUp,
        addOverlayImage,
        addOverlayImages,
        removeOverlayImage,
        updateOverlayImageSize,
        updateOverlayImageLayer,
        updateOverlayImageRotation,
        alignSelected,
        distributeElements,
        applySnapPresetToActive,
        reorderScreenshots,
        reorderLayers,
        toggleOverlayLayer,
        saveProjectFile,
        updateOverlayImageShadow,
        addDevice,
        selectDevice,
        removeDevice,
        bringDeviceForward,
        sendDeviceBackward,
        bringImageForward,
        sendImageBackward,
        bringImageToFront,
        sendImageToBack,
        handleFileUpload,
        handleExport,
        importProjectFile,
        getBackgroundStyle,
        resetEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
