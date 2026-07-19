interface ShortcutGroup {
  title: string;
  items: { keys: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "History",
    items: [
      { keys: "⌘ Z", description: "Undo" },
      { keys: "⌘ ⇧ Z", description: "Redo" },
    ],
  },
  {
    title: "Screenshots",
    items: [
      { keys: "⌘ D", description: "Duplicate active screenshot" },
      { keys: "⌥ ← →", description: "Previous / next screen" },
      { keys: "1 – 9", description: "Jump to screen by number" },
    ],
  },
  {
    title: "Selection",
    items: [
      { keys: "↑ ↓ ← →", description: "Nudge selected element" },
      { keys: "⇧ + arrows", description: "Nudge by 2%" },
      { keys: "Delete", description: "Remove selected overlay or device" },
    ],
  },
  {
    title: "Align",
    items: [
      { keys: "⌘ ⇧ H", description: "Center horizontally" },
      { keys: "⌘ ⇧ V", description: "Center vertically" },
      { keys: "⌘ ⇧ M", description: "Center on canvas" },
      { keys: "⌘ ⇧ D", description: "Align to device" },
    ],
  },
  {
    title: "Rotate",
    items: [{ keys: "[  ]", description: "Rotate device or overlay ±15°" }],
  },
  {
    title: "Help",
    items: [{ keys: "?", description: "Show keyboard shortcuts" }],
  },
];

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Keyboard shortcuts
            </h2>
            <p className="text-xs text-zinc-500">
              Works when you are not typing in a text field
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-4">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between gap-4 rounded-lg bg-[#141414] px-3 py-2"
                  >
                    <span className="text-sm text-zinc-300">
                      {item.description}
                    </span>
                    <kbd className="shrink-0 rounded border border-white/10 bg-[#0a0a0a] px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
