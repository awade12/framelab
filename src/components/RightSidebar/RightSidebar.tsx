import { useState } from "react";
import { useEditor } from "../../context/EditorContext";
import { gradientPresets, solidColorPresets } from "../../constants";
import type { DeviceInstance } from "../../types";
import { DeviceInstancesSection } from "./DeviceInstancesSection";
import { ScreenshotImageSection } from "./ScreenshotImageSection";
import { StatusBarSection } from "./StatusBarSection";
import { PositionPresets } from "./PositionPresets";
import { LayoutSection } from "./LayoutSection";
import { ContentSection } from "./ContentSection";
import { AppearanceSection } from "./AppearanceSection";
import { LayersTabPanel } from "./LayersTabPanel";
import { SidebarTabs, type RightSidebarTab } from "./SidebarTabs";
import { STYLES } from "./constants";

export const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState<RightSidebarTab>("device");

  const {
    activeScreenshot,
    activeDevice,
    updateActiveScreenshot,
    headlineFontSize,
    setHeadlineFontSize,
    subheadlineFontSize,
    setSubheadlineFontSize,
    setIsFontPickerOpen,
    fileInputRef,
    handleFileUpload,
    overlayImageInputRef,
    addOverlayImage,
    addOverlayImages,
    addDevice,
    selectDevice,
    removeDevice,
    bringDeviceForward,
    sendDeviceBackward,
    customGradientPresets,
    saveCustomGradientPreset,
  } = useEditor();

  const updateActiveDevice = (updates: Partial<DeviceInstance>) => {
    if (!activeDevice) return;
    updateActiveScreenshot({
      devices: activeScreenshot.devices.map((device) =>
        device.id === activeDevice.id ? { ...device, ...updates } : device,
      ),
    });
  };

  return (
    <aside className={STYLES.sidebar}>
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={STYLES.content} role="tabpanel">
        {activeTab === "device" && (
          <>
            <DeviceInstancesSection
              screenshot={activeScreenshot}
              onAddDevice={addDevice}
              onSelectDevice={selectDevice}
              onRemoveDevice={removeDevice}
              onBringForward={bringDeviceForward}
              onSendBackward={sendDeviceBackward}
            />

            {activeDevice ? (
              <>
                <ScreenshotImageSection
                  device={activeDevice}
                  fileInputRef={fileInputRef}
                  onFileUpload={handleFileUpload}
                  onUpdateDevice={updateActiveDevice}
                />

                <StatusBarSection
                  device={activeDevice}
                  onUpdateDevice={updateActiveDevice}
                />

                <PositionPresets
                  device={activeDevice}
                  onUpdateDevice={updateActiveDevice}
                />

                <LayoutSection
                  device={activeDevice}
                  screenshot={activeScreenshot}
                  headlineFontSize={headlineFontSize}
                  subheadlineFontSize={subheadlineFontSize}
                  onUpdateDevice={updateActiveDevice}
                  onUpdateScreenshot={updateActiveScreenshot}
                  onHeadlineSizeChange={setHeadlineFontSize}
                  onSubheadlineSizeChange={setSubheadlineFontSize}
                />
              </>
            ) : null}
          </>
        )}

        {activeTab === "text" && (
          <ContentSection
            screenshot={activeScreenshot}
            onUpdateScreenshot={updateActiveScreenshot}
          />
        )}

        {activeTab === "style" && (
          <AppearanceSection
            screenshot={activeScreenshot}
            gradientPresets={gradientPresets}
            userGradientPresets={customGradientPresets}
            solidColorPresets={solidColorPresets}
            onUpdateScreenshot={updateActiveScreenshot}
            onSaveGradientPreset={saveCustomGradientPreset}
            onOpenFontPicker={() => setIsFontPickerOpen(true)}
          />
        )}

        {activeTab === "layers" && (
          <>
            <input
              ref={overlayImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                const files = event.target.files;
                if (!files || files.length === 0) return;
                if (files.length === 1) {
                  addOverlayImage(files[0]);
                } else {
                  addOverlayImages(Array.from(files));
                }
                event.target.value = "";
              }}
            />
            <LayersTabPanel />
          </>
        )}
      </div>
    </aside>
  );
};
