import { Check, Loader2 } from "lucide-react";
import type { FontConfig } from "../../lib/google-fonts";
import { useLazyFont } from "../../hooks/useLazyFont";
import { getFontFamily, type PreviewMode } from "./utils";
import { PREVIEW_TEXT } from "./constants";

interface FontCardProps {
  font: FontConfig;
  isSelected: boolean;
  previewMode: PreviewMode;
  onSelect: () => void;
}

export const FontCard = ({
  font,
  isSelected,
  previewMode,
  onSelect,
}: FontCardProps) => {
  const { ref, isLoaded } = useLazyFont(font.family, font.weights);
  const previewText = PREVIEW_TEXT[previewMode];
  const headlineWeight = font.weights.includes("700") ? "700" : font.weights.at(-1) ?? "400";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col rounded-lg border p-4 text-left transition-all ${
        isSelected
          ? "border-violet-400/70 bg-violet-500/10 ring-1 ring-violet-400/40"
          : "border-white/10 bg-[#141414] hover:border-white/25 hover:bg-[#1c1c1c]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-zinc-100">{font.family}</span>
            {isSelected && (
              <Check size={14} className="shrink-0 text-violet-300" aria-hidden />
            )}
          </div>
          <span className="mt-1 inline-block rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
            {font.category}
          </span>
        </div>

        {!isLoaded && (
          <Loader2 size={14} className="mt-1 shrink-0 animate-spin text-zinc-600" />
        )}
      </div>

      <div className="space-y-2">
        <p
          className={`truncate text-xl leading-tight text-zinc-200 transition-opacity ${
            isLoaded ? "opacity-100" : "opacity-40"
          }`}
          style={{
            fontFamily: getFontFamily(font.family, font.category),
            fontWeight: headlineWeight,
          }}
        >
          {previewText}
        </p>
        <p
          className={`truncate text-sm text-zinc-500 transition-opacity ${
            isLoaded ? "opacity-100" : "opacity-30"
          }`}
          style={{
            fontFamily: getFontFamily(font.family, font.category),
            fontWeight: "400",
          }}
        >
          {PREVIEW_TEXT.body}
        </p>
      </div>
    </button>
  );
};
