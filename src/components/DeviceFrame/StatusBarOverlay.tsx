import type { StatusBarConfig } from "../../types";
import { getStatusBarColor } from "../../lib/status-bar";

interface StatusBarOverlayProps {
  config: StatusBarConfig;
}

const signalBars = (signal: StatusBarConfig["signal"]) => {
  switch (signal) {
    case "full":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
    default:
      return 0;
  }
};

export const StatusBarOverlay = ({ config }: StatusBarOverlayProps) => {
  if (!config.enabled) return null;

  const color = getStatusBarColor(config.style);
  const bars = signalBars(config.signal);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[15] flex items-center justify-between px-[7%]"
      style={{ height: "5.2%" }}
    >
      <span
        className="font-semibold leading-none tracking-tight"
        style={{
          color,
          fontSize: "clamp(8px, 2.8vw, 14px)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        {config.time}
      </span>

      <div className="flex items-center gap-[0.35em]" style={{ color }}>
        {bars > 0 && (
          <div className="flex items-end gap-[0.12em]" style={{ height: "0.95em" }}>
            {Array.from({ length: bars }).map((_, index) => (
              <span
                key={index}
                className="block rounded-[1px]"
                style={{
                  width: "0.18em",
                  height: `${((index + 1) / 4) * 100}%`,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}

        {config.showWifi && (
          <svg
            viewBox="0 0 16 12"
            className="block"
            style={{ width: "1.05em", height: "0.8em" }}
            aria-hidden
          >
            <path
              d="M1 4.5a10 10 0 0 1 14 0"
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M4 7.5a6 6 0 0 1 8 0"
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M7 10a2 2 0 0 1 2 0"
              fill="none"
              stroke={color}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="8" cy="10.8" r="0.9" fill={color} />
          </svg>
        )}

        <div
          className="relative flex items-center"
          style={{ width: "1.35em", height: "0.72em" }}
        >
          <div
            className="absolute inset-0 rounded-[2px]"
            style={{ border: `1.2px solid ${color}` }}
          />
          <div
            className="absolute right-[-0.14em] top-1/2 -translate-y-1/2 rounded-[1px]"
            style={{
              width: "0.12em",
              height: "0.36em",
              backgroundColor: color,
            }}
          />
          <div
            className="absolute left-[0.08em] top-[0.08em] bottom-[0.08em] rounded-[1px]"
            style={{
              width: `calc(${config.battery}% - 16%)`,
              maxWidth: "calc(100% - 16%)",
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};
