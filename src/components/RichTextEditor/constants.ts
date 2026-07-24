/**
 * RichTextEditor Constants
 */

import type { ActiveStyles } from "./types";

export const DEFAULT_ACTIVE_STYLES: ActiveStyles = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
};

export const DEFAULT_TEXT_COLOR = "#ffffff";
export const DEFAULT_BACKGROUND_COLOR = "#fef08a";
export const ICON_SIZE = 14;

export const TEXT_COLOR_PRESETS = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#94a3b8",
  "#0f172a",
  "#000000",
  "#fbbf24",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#84cc16",
] as const;

export const HIGHLIGHT_COLOR_PRESETS = [
  "#fef08a",
  "#fdba74",
  "#fca5a5",
  "#f9a8d4",
  "#d8b4fe",
  "#a5b4fc",
  "#7dd3fc",
  "#6ee7b7",
  "#bef264",
  "#ffffff",
] as const;

export const STYLES = {
  container:
    "group/editor rounded-xl border border-white/10 bg-[#222] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-white/25 focus-within:ring-1 focus-within:ring-white/15",

  toolbar:
    "flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-white/10 bg-[#1a1a1a] px-1.5 py-1.5",

  toolbarGroup: "flex items-center gap-0.5",

  toolbarButton:
    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 leading-none appearance-none transition-colors",

  toolbarButtonActive: "bg-white text-black",

  toolbarButtonInactive:
    "text-zinc-400 hover:bg-white/10 hover:text-white",

  toolbarButtonWide:
    "inline-flex h-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent px-1.5 text-[10px] font-semibold tracking-wide appearance-none transition-colors",

  separator: "mx-0.5 h-4 w-px shrink-0 self-center bg-white/10",

  editor:
    "px-3 py-2.5 leading-snug text-white outline-none",

  editorSm: "min-h-[72px] text-sm",
  editorMd: "min-h-[88px] text-base",
  editorLg: "min-h-[104px] text-lg font-semibold",

  placeholder:
    "pointer-events-none absolute left-3 top-2.5 text-zinc-500",

  placeholderSm: "text-sm",
  placeholderMd: "text-base",
  placeholderLg: "text-lg font-semibold",

  footer:
    "flex items-center justify-between rounded-b-xl border-t border-white/5 bg-[#1a1a1a]/60 px-2.5 py-1 text-[10px] text-zinc-500",

  tooltipWrapper: "relative flex shrink-0 group",

  tooltip:
    "pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 translate-y-1 rounded-md border border-white/10 bg-[#111] px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100",

  colorMenu:
    "absolute left-1/2 top-full z-40 mt-1.5 w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-[#161616] p-2 shadow-xl",

  colorSwatch:
    "h-5 w-5 rounded-md border border-white/15 transition-transform hover:scale-110",

  colorSwatchActive: "ring-2 ring-white ring-offset-1 ring-offset-[#161616]",
} as const;
