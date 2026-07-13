import { CheckCircle2, Download, Loader2, Sparkles } from "lucide-react";
import { APP_NAME } from "../constants";
import type { ExportProgressState } from "../lib/export-progress";

interface ExportProgressModalProps {
  state: ExportProgressState;
}

const STEPS = [
  "Prepare canvas pipeline",
  "Load fonts & assets",
  "Render screenshots",
  "Composite devices",
  "Optimize & package",
];

export const ExportProgressModal = ({ state }: ExportProgressModalProps) => {
  if (!state.isOpen) return null;

  const activeStepIndex =
    state.progress < 12
      ? 0
      : state.progress < 22
        ? 1
        : state.progress < 88
          ? 2
          : state.progress < 96
            ? 3
            : 4;

  const isComplete = state.status === "complete";
  const isError = state.status === "error";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-progress-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-[0_32px_120px_rgba(0,0,0,0.65)]"
      >
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                <Sparkles size={12} className="text-violet-300" />
                {APP_NAME} Export
              </div>
              <h2
                id="export-progress-title"
                className="text-2xl font-semibold tracking-tight text-white"
              >
                {isComplete
                  ? "Screenshots exported"
                  : isError
                    ? "Export failed"
                    : "Building your store set"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {state.detail || "Preparing high-resolution PNG exports…"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Progress
              </p>
              <p className="text-lg font-semibold tabular-nums text-white">
                {Math.round(state.progress)}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
              <span>{state.phase || "Starting export…"}</span>
              {state.screenshotTotal > 0 && (
                <span>
                  Screen {Math.min(state.screenshotIndex, state.screenshotTotal)}/
                  {state.screenshotTotal}
                </span>
              )}
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isError
                    ? "bg-red-500"
                    : isComplete
                      ? "bg-emerald-400"
                      : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-300"
                }`}
                style={{ width: `${Math.max(4, state.progress)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Output size
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {state.outputWidth.toLocaleString()}×
                {state.outputHeight.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Quality
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {state.qualityLabel}
              </p>
            </div>
            <div className="col-span-2 rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Store preset
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {state.exportLabel}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Pipeline
            </p>
            <div className="space-y-2">
              {STEPS.map((step, index) => {
                const done = index < activeStepIndex || isComplete;
                const active = index === activeStepIndex && !isComplete && !isError;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${
                      active ? "bg-white/5" : ""
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                    ) : active ? (
                      <Loader2
                        size={16}
                        className="shrink-0 animate-spin text-violet-300"
                      />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border border-white/15" />
                    )}
                    <span
                      className={`text-sm ${
                        done
                          ? "text-zinc-300"
                          : active
                            ? "text-white"
                            : "text-zinc-600"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            {isComplete ? (
              <Download size={18} className="text-emerald-300" />
            ) : (
              <Loader2 size={18} className="animate-spin text-violet-300" />
            )}
            <p className="text-sm text-zinc-300">
              {isComplete
                ? "Download started. Check your browser downloads folder."
                : isError
                  ? "Something went wrong. Try again in a moment."
                  : "High-quality PNG export usually takes ~10 seconds for full optimization."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
