import type { DeviceInstance, StatusBarConfig, StatusBarSignal } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface StatusBarSectionProps {
  device: DeviceInstance;
  onUpdateDevice: (updates: Partial<DeviceInstance>) => void;
}

const SIGNAL_OPTIONS: { id: StatusBarSignal; label: string }[] = [
  { id: "full", label: "Full" },
  { id: "medium", label: "Mid" },
  { id: "low", label: "Low" },
  { id: "none", label: "Off" },
];

export const StatusBarSection = ({
  device,
  onUpdateDevice,
}: StatusBarSectionProps) => {
  const statusBar = device.statusBar;

  const updateStatusBar = (updates: Partial<StatusBarConfig>) => {
    onUpdateDevice({
      statusBar: { ...statusBar, ...updates },
    });
  };

  return (
    <SidebarSection title="Status Bar">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Show status bar</label>
          <button
            type="button"
            onClick={() => updateStatusBar({ enabled: !statusBar.enabled })}
            className={`${STYLES.toggle} ${
              statusBar.enabled ? STYLES.toggleActive : STYLES.toggleInactive
            }`}
          >
            <div
              className={`${STYLES.toggleKnob} mt-0.5 ${
                statusBar.enabled ? STYLES.toggleKnobActive : STYLES.toggleKnobInactive
              }`}
            />
          </button>
        </div>

        {statusBar.enabled && (
          <>
            <label className="block">
              <span className="mb-1 block text-xs text-gray-400">Time</span>
              <input
                type="text"
                value={statusBar.time}
                onChange={(e) => updateStatusBar({ time: e.target.value })}
                placeholder="9:41"
                className="w-full rounded-md border border-white/10 bg-[#2a2a2a] px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </label>

            <div>
              <label className="mb-2 block text-xs text-gray-400">Style</label>
              <div className="flex gap-1 p-0.5 bg-[#2a2a2a] rounded-lg">
                <button
                  type="button"
                  className={`${STYLES.modeButton} ${
                    statusBar.style === "light"
                      ? STYLES.modeButtonActive
                      : STYLES.modeButtonInactive
                  }`}
                  onClick={() => updateStatusBar({ style: "light" })}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={`${STYLES.modeButton} ${
                    statusBar.style === "dark"
                      ? STYLES.modeButtonActive
                      : STYLES.modeButtonInactive
                  }`}
                  onClick={() => updateStatusBar({ style: "dark" })}
                >
                  Dark
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-zinc-500">
                Light text for dark screenshots, dark text for light screenshots.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs text-gray-400">Signal</label>
              <div className="grid grid-cols-4 gap-1">
                {SIGNAL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateStatusBar({ signal: option.id })}
                    className={`rounded-md py-1.5 text-[11px] ${
                      statusBar.signal === option.id
                        ? "bg-white text-black"
                        : "bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs text-gray-400">Battery</label>
                <span className="text-[11px] text-zinc-500">{statusBar.battery}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={statusBar.battery}
                onChange={(e) =>
                  updateStatusBar({ battery: Number(e.target.value) })
                }
                className="w-full accent-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Wi‑Fi icon</label>
              <button
                type="button"
                onClick={() => updateStatusBar({ showWifi: !statusBar.showWifi })}
                className={`${STYLES.toggle} ${
                  statusBar.showWifi ? STYLES.toggleActive : STYLES.toggleInactive
                }`}
              >
                <div
                  className={`${STYLES.toggleKnob} mt-0.5 ${
                    statusBar.showWifi
                      ? STYLES.toggleKnobActive
                      : STYLES.toggleKnobInactive
                  }`}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </SidebarSection>
  );
};
