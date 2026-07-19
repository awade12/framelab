export const STYLES = {
  sidebar: "flex h-full w-72 min-w-72 shrink-0 flex-col border-r border-white/10 bg-[#141414]",

  header: "shrink-0 px-4 pb-3 pt-4",

  scroll: "flex-1 overflow-y-auto",

  block: "px-4 py-4",

  divider: "border-t border-white/[0.06]",

  label: "mb-2.5 text-[11px] font-medium text-zinc-500",

  labelRow: "mb-2.5 flex items-baseline justify-between gap-2",

  meta: "text-[11px] tabular-nums text-zinc-600",

  select:
    "w-full appearance-none rounded-md bg-white/[0.04] px-3 py-2.5 pr-9 text-[13px] text-zinc-200 outline-none ring-1 ring-white/[0.08] transition-shadow focus:ring-white/20",

  primaryButton:
    "w-full rounded-md bg-white py-2.5 text-[13px] font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60",

  ghostLink:
    "text-[12px] text-zinc-500 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30",

  iconButton:
    "rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30",

  footer: "shrink-0 border-t border-white/[0.06] px-4 py-4",

  segmentTrack: "flex rounded-md bg-white/[0.04] p-0.5 ring-1 ring-white/[0.06]",

  segmentButton:
    "flex-1 rounded px-2 py-1.5 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-30",

  segmentActive: "bg-white/10 text-white",

  segmentInactive: "text-zinc-500 hover:text-zinc-300",

  colorPicker: "flex gap-2",

  colorButton: "h-7 w-7 rounded-full border-2 transition-transform",

  colorButtonActive: "scale-105 border-white",

  colorButtonInactive: "border-transparent hover:scale-105",
} as const;
