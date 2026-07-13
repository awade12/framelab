import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditor } from "../../context/EditorContext";
import { devices, exportSizes } from "../../constants";
import { useLeftSidebarCollapsed } from "../../hooks/useLeftSidebarCollapsed";
import { SidebarHeader } from "./SidebarHeader";
import { DeviceSection } from "./DeviceSection";
import { ExportSection } from "./ExportSection";
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
  } = useEditor();

  const handleDeviceSelect = (deviceId: string, defaultColorId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedColorId(defaultColorId);
  };

  return (
    <div className="relative h-full shrink-0">
      <div
        className={`h-full overflow-hidden transition-[width] duration-300 ease-in-out ${
          isCollapsed ? "w-0" : "w-72"
        }`}
      >
        <aside className={`${STYLES.sidebar} h-full min-w-72`}>
          <SidebarHeader onCollapse={() => setIsCollapsed(true)} />

          <div className={STYLES.content}>
            <div className={STYLES.section}>
              <h3 className={STYLES.sectionTitle}>Quick actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="rounded-md bg-[#2a2a2a] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#333]"
                >
                  Templates
                </button>
                <button
                  type="button"
                  onClick={applyStyleToAll}
                  className="rounded-md bg-[#2a2a2a] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#333]"
                >
                  Apply style to all
                </button>
                <button
                  type="button"
                  onClick={duplicateActiveScreenshot}
                  className="rounded-md bg-[#2a2a2a] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#333]"
                >
                  Duplicate screen
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={!canUndo}
                    className="rounded-md bg-[#2a2a2a] px-2 py-2 text-xs text-gray-200 transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Undo
                  </button>
                  <button
                    type="button"
                    onClick={redo}
                    disabled={!canRedo}
                    className="rounded-md bg-[#2a2a2a] px-2 py-2 text-xs text-gray-200 transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Redo
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-zinc-500">
                ⌘Z undo · ⌘⇧Z redo · ⌘D duplicate · arrows nudge
              </p>
            </div>

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
              screenshotCount={screenshots.length}
              isExporting={isExporting}
              onSizeSelect={setExportSizeId}
              onQualitySelect={setExportQuality}
              onExport={handleExport}
            />
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`absolute top-[4.75rem] z-30 flex h-10 w-5 items-center justify-center border border-white/10 bg-[#1e1e1e] text-zinc-400 shadow-lg transition-all duration-300 hover:bg-[#2a2a2a] hover:text-white ${
          isCollapsed
            ? "left-0 rounded-r-lg border-l-0"
            : "left-72 -translate-x-full rounded-l-lg border-r-0"
        }`}
        title={isCollapsed ? "Open sidebar" : "Close sidebar"}
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};
