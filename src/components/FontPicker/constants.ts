export const PREVIEW_TEXT = {
  headline: "Track every flight in real time",
  body: "The quick brown fox jumps over the lazy dog",
} as const;

export const STYLES = {
  backdrop:
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200",

  modal:
    "w-full max-w-5xl bg-[#1a1a1a] rounded-xl shadow-2xl flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200 border border-white/10 overflow-hidden",

  input:
    "w-full bg-[#252525] text-white pl-10 pr-10 py-2.5 rounded-lg border border-white/10 focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/40 outline-none transition-all placeholder:text-zinc-500 text-sm",

  iconButton:
    "p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white",

  cancelButton:
    "px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-zinc-300 rounded-lg transition-colors text-sm font-medium border border-white/10",

  categoryTab:
    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",

  categoryTabActive: "bg-white text-black",

  categoryTabInactive:
    "bg-[#252525] text-zinc-400 hover:text-white hover:bg-[#2f2f2f] border border-white/5",
} as const;
