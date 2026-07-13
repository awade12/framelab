import { screenshotTemplates } from "../lib/templates";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (templateId: string) => void;
}

export const TemplatesModal = ({
  isOpen,
  onClose,
  onApply,
}: TemplatesModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Templates"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-white">Templates</h2>
            <p className="text-xs text-zinc-500">
              Start from a full App Store set, then drop in your screenshots
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

        <div className="grid flex-1 gap-3 overflow-y-auto p-4 md:grid-cols-2">
          {screenshotTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onApply(template.id)}
              className="rounded-xl border border-white/10 bg-[#141414] p-4 text-left transition-colors hover:border-white/25 hover:bg-[#1c1c1c]"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{template.name}</h3>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
                  {template.screenshots.length} screens
                </span>
              </div>
              <p className="text-sm text-zinc-400">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
