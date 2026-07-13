import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { CanvasPreview } from "./CanvasPreview";
import { FontPicker } from "./FontPicker";
import { GitHubStarModal } from "./GitHubStarModal";
import { TemplatesModal } from "./TemplatesModal";
import { ExportProgressModal } from "./ExportProgressModal";
import { useEditor } from "../context/EditorContext";

export const EditorLayout = () => {
  const {
    isFontPickerOpen,
    setIsFontPickerOpen,
    isStarModalOpen,
    setIsStarModalOpen,
    isTemplatesOpen,
    setIsTemplatesOpen,
    applyTemplate,
    activeScreenshot,
    updateActiveScreenshot,
    exportProgress,
  } = useEditor();

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <CanvasPreview />
        <RightSidebar />
        <FontPicker
          isOpen={isFontPickerOpen}
          onClose={() => setIsFontPickerOpen(false)}
          selectedFontFamily={activeScreenshot.fontFamily}
          onSelect={(fontFamily: string) =>
            updateActiveScreenshot({ fontFamily })
          }
        />
        <TemplatesModal
          isOpen={isTemplatesOpen}
          onClose={() => setIsTemplatesOpen(false)}
          onApply={applyTemplate}
        />
        <GitHubStarModal
          isOpen={isStarModalOpen}
          onClose={() => setIsStarModalOpen(false)}
        />
        <ExportProgressModal state={exportProgress} />
      </div>
    </div>
  );
};
