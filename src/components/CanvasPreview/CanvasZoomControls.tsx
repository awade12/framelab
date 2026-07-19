import type { CanvasZoom } from "../../types";

interface CanvasZoomControlsProps {
  zoom: CanvasZoom;
  onChange: (zoom: CanvasZoom) => void;
}

const OPTIONS: { value: CanvasZoom; label: string }[] = [
  { value: "fit", label: "Fit" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
];

export const CanvasZoomControls = ({
  zoom,
  onChange,
}: CanvasZoomControlsProps) => (
  <div className="pointer-events-auto absolute right-4 top-4 z-[500] flex items-center gap-1 rounded-md bg-black/60 p-0.5 ring-1 ring-white/10 backdrop-blur-sm">
    {OPTIONS.map(({ value, label }) => (
      <button
        key={String(value)}
        type="button"
        onClick={() => onChange(value)}
        className={`rounded px-2 py-1 text-[10px] transition-colors ${
          zoom === value
            ? "bg-white/15 text-white"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
