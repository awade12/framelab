import { ChevronRight } from "lucide-react";
import { useEditor } from "../../context/EditorContext";
import { devices, exportSizes } from "../../constants";
import { getExportScreenshots } from "../../lib/layer-state";
import { useLeftSidebarCollapsed } from "../../hooks/useLeftSidebarCollapsed";
import { SidebarHeader } from "./SidebarHeader";
import { QuickActionsSection } from "./QuickActionsSection";
import { GuideTogglesSection } from "./GuideTogglesSection";
import { DeviceSection } from "./DeviceSection";
import { ExportSection } from "./ExportSection";
import { ExportFooter } from "./ExportFooter";
import { STYLES } from "./constants";

export const LeftSidebar = () => {
  const { isCollapsed, toggle, setIsCollapsed } = useLeftSidebarCollapsed();
  const {
    selectedDeviceId,
    setSelectedDeviceId,
    selectedColorId,
    setSelectedColorId,
    selectedDevice,
    exportSizeId,
    setExportSizeId,
    exportQuality,
    setExportQuality,
    handleExport,
    isExporting,
    screenshots,
    setIsTemplatesOpen,
    canUndo,
    canRedo,
    undo,
    redo,
    applyStyleToAll,
    duplicateActiveScreenshot,
    addScreenshot,
    importProjectFile,
    saveProjectFile,
    guideSettings,
    toggleGuideSetting,
    setIsShortcutsOpen,
    exportScope,
    setExportScope,
    activeScreenshotId,
  } = useEditor();

  const exportCount = getExportScreenshots(
    screenshots,
    exportScope,
    activeScreenshotId,
  ).length;

  const handleDeviceSelect = (deviceId: string, defaultColorId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedColorId(defaultColorId);
  };

  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 shrink-0 flex-col border-r border-white/10 bg-[#141414]">
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-full items-center justify-center text-zinc-600 transition-colors hover:text-zinc-300"
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-72 shrink-0">
      <aside className={`${STYLES.sidebar} h-full`}>
        <SidebarHeader
          onCollapse={() => setIsCollapsed(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        <div className={STYLES.scroll}>
          <QuickActionsSection
            screenshotCount={screenshots.length}
            canUndo={canUndo}
            canRedo={canRedo}
            onAddScreenshot={addScreenshot}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onApplyStyleToAll={applyStyleToAll}
            onDuplicate={duplicateActiveScreenshot}
            onUndo={undo}
            onRedo={redo}
          />

          <GuideTogglesSection
            showSafeArea={guideSettings.showSafeArea}
            showThirds={guideSettings.showThirds}
            showGoldenRatio={guideSettings.showGoldenRatio}
            onToggleSafeArea={() => toggleGuideSetting("showSafeArea")}
            onToggleThirds={() => toggleGuideSetting("showThirds")}
            onToggleGoldenRatio={() => toggleGuideSetting("showGoldenRatio")}
          />

          <DeviceSection
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            selectedColorId={selectedColorId}
            selectedDevice={selectedDevice}
            onDeviceSelect={handleDeviceSelect}
            onColorSelect={setSelectedColorId}
          />

          <ExportSection
            exportSizes={exportSizes}
            selectedSizeId={exportSizeId}
            exportQuality={exportQuality}
            onSizeSelect={setExportSizeId}
            onQualitySelect={setExportQuality}
          />
        </div>

        <ExportFooter
          exportSizes={exportSizes}
          selectedSizeId={exportSizeId}
          exportQuality={exportQuality}
          exportScope={exportScope}
          exportCount={exportCount}
          isExporting={isExporting}
          onExportScopeChange={setExportScope}
          onExport={handleExport}
          onSaveProject={saveProjectFile}
          onImportProject={importProjectFile}
        />
      </aside>
    </div>
  );
};
