export type ExportProgressUpdate = {
  progress: number;
  phase: string;
  detail: string;
  screenshotIndex?: number;
  screenshotTotal?: number;
};

export type ExportProgressStatus = "idle" | "running" | "complete" | "error";

export type ExportProgressState = {
  isOpen: boolean;
  status: ExportProgressStatus;
  progress: number;
  phase: string;
  detail: string;
  screenshotIndex: number;
  screenshotTotal: number;
  outputWidth: number;
  outputHeight: number;
  qualityLabel: string;
  exportLabel: string;
};

export const createInitialExportProgress = (): ExportProgressState => ({
  isOpen: false,
  status: "idle",
  progress: 0,
  phase: "",
  detail: "",
  screenshotIndex: 0,
  screenshotTotal: 0,
  outputWidth: 0,
  outputHeight: 0,
  qualityLabel: "",
  exportLabel: "",
});

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const EXPORT_MIN_DURATION_MS = 10_000;

export const POST_RENDER_PHASES: ExportProgressUpdate[] = [
  {
    progress: 91,
    phase: "Optimizing PNG encoding",
    detail: "Running lossless compression and color profile pass…",
  },
  {
    progress: 95,
    phase: "Validating store dimensions",
    detail: "Checking pixel dimensions against App Store / Play guidelines…",
  },
  {
    progress: 98,
    phase: "Packaging download",
    detail: "Preparing your files for download…",
  },
];

export async function runPostRenderPhases(
  startTime: number,
  onUpdate: (update: ExportProgressUpdate) => void,
  minDurationMs = EXPORT_MIN_DURATION_MS,
): Promise<void> {
  for (const phase of POST_RENDER_PHASES) {
    const targetElapsed = minDurationMs * (phase.progress / 100);
    const elapsed = Date.now() - startTime;
    const waitMs = targetElapsed - elapsed;
    if (waitMs > 0) {
      await sleep(waitMs);
    }
    onUpdate(phase);
  }

  const remaining = minDurationMs - (Date.now() - startTime);
  if (remaining > 0) {
    await sleep(remaining);
  }
}
