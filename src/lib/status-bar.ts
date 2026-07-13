import type { StatusBarConfig, StatusBarSignal, StatusBarStyle } from "../types";

export const DEFAULT_STATUS_BAR: StatusBarConfig = {
  enabled: false,
  time: "9:41",
  style: "light",
  signal: "full",
  battery: 100,
  showWifi: true,
};

export const normalizeStatusBar = (
  value: Partial<StatusBarConfig> | undefined,
): StatusBarConfig => ({
  ...DEFAULT_STATUS_BAR,
  ...value,
  time: typeof value?.time === "string" && value.time.trim() ? value.time : DEFAULT_STATUS_BAR.time,
  style: value?.style === "dark" ? "dark" : "light",
  signal: isValidSignal(value?.signal) ? value.signal : DEFAULT_STATUS_BAR.signal,
  battery:
    typeof value?.battery === "number"
      ? Math.min(100, Math.max(0, Math.round(value.battery)))
      : DEFAULT_STATUS_BAR.battery,
  showWifi: value?.showWifi ?? DEFAULT_STATUS_BAR.showWifi,
  enabled: value?.enabled ?? DEFAULT_STATUS_BAR.enabled,
});

const isValidSignal = (signal: unknown): signal is StatusBarSignal =>
  signal === "full" || signal === "medium" || signal === "low" || signal === "none";

export const getStatusBarColor = (style: StatusBarStyle): string =>
  style === "light" ? "#ffffff" : "#000000";

const signalBarCount = (signal: StatusBarSignal): number => {
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

export const drawStatusBar = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  config: StatusBarConfig,
  scaleX: number,
) => {
  if (!config.enabled) return;

  const color = getStatusBarColor(config.style);
  const barHeight = screenH * 0.052;
  const paddingX = screenW * 0.07;
  const fontSize = Math.max(10 * scaleX, barHeight * 0.58);
  const centerY = screenY + barHeight * 0.62;

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(config.time, screenX + paddingX, centerY);

  const iconColor = color;
  const iconScale = scaleX;
  let cursorX = screenX + screenW - paddingX;

  const drawBattery = () => {
    const bodyW = 22 * iconScale;
    const bodyH = 11 * iconScale;
    const tipW = 2.5 * iconScale;
    const tipH = 5 * iconScale;
    const x = cursorX - bodyW - tipW;
    const y = centerY - bodyH / 2;

    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 1.2 * iconScale;
    ctx.strokeRect(x, y, bodyW, bodyH);
    ctx.fillStyle = iconColor;
    ctx.fillRect(x + bodyW, centerY - tipH / 2, tipW, tipH);

    const fillW = ((bodyW - 3 * iconScale) * config.battery) / 100;
    if (fillW > 0) {
      ctx.fillRect(x + 1.5 * iconScale, y + 1.5 * iconScale, fillW, bodyH - 3 * iconScale);
    }

    cursorX = x - 8 * iconScale;
  };

  const drawWifi = () => {
    if (!config.showWifi) return;

    const size = 14 * iconScale;
    const x = cursorX - size;
    const y = centerY;

    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 1.4 * iconScale;
    ctx.lineCap = "round";

    for (let i = 0; i < 3; i++) {
      const radius = size * (0.35 + i * 0.22);
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size * 0.15, radius, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x + size / 2, y + size * 0.15, 1.8 * iconScale, 0, Math.PI * 2);
    ctx.fillStyle = iconColor;
    ctx.fill();

    cursorX = x - 8 * iconScale;
  };

  const drawSignal = () => {
    const bars = signalBarCount(config.signal);
    if (bars === 0) return;

    const barW = 2.6 * iconScale;
    const gap = 1.8 * iconScale;
    const maxH = 11 * iconScale;
    const baseX = cursorX - bars * (barW + gap);

    ctx.fillStyle = iconColor;
    for (let i = 0; i < bars; i++) {
      const h = maxH * ((i + 1) / 4);
      const x = baseX + i * (barW + gap);
      const y = centerY + maxH / 2 - h;
      ctx.fillRect(x, y, barW, h);
    }

    cursorX = baseX - 4 * iconScale;
  };

  drawBattery();
  drawWifi();
  drawSignal();

  ctx.restore();
};
