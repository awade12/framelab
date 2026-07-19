import {
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Lock,
  LockOpen,
  Plus,
  Smartphone,
  Type,
} from "lucide-react";
import type { Screenshot } from "../../types";
import type { LayerEntry } from "../../lib/layer-stack";
import { isLayerHidden, isLayerLocked } from "../../lib/layer-state";

interface UnifiedLayersPanelProps {
  screenshot: Screenshot;
  layers: LayerEntry[];
  selectedKey: string | null;
  dragIndex: number | null;
  dropIndex: number | null;
  onSelect: (entry: LayerEntry) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  onToggleOverlayLayer: (imageId: string) => void;
  onToggleHidden: (entry: LayerEntry) => void;
  onToggleLocked: (entry: LayerEntry) => void;
  onAddAsset: () => void;
}

const entryKey = (entry: LayerEntry) => {
  if (entry.kind === "headline") return "headline";
  if (entry.kind === "subheadline") return "subheadline";
  if (entry.kind === "device") return `device:${entry.id}`;
  return `overlay:${entry.id}`;
};

type LayerGroup = {
  id: string;
  label: string;
  hint?: string;
  items: { entry: LayerEntry; index: number }[];
};

const buildLayerGroups = (layers: LayerEntry[]): LayerGroup[] => {
  const groups: LayerGroup[] = [];
  let current: LayerGroup | null = null;

  const pushGroup = (id: string, label: string, hint?: string) => {
    current = { id, label, hint, items: [] };
    groups.push(current);
  };

  const ensureGroup = (id: string, label: string, hint?: string) => {
    if (current?.id !== id) {
      pushGroup(id, label, hint);
    }
  };

  for (const [index, entry] of layers.entries()) {
    if (entry.kind === "overlay" && entry.layer === "behind") {
      ensureGroup("behind", "Behind device");
      current!.items.push({ entry, index });
      continue;
    }

    if (entry.kind === "headline" || entry.kind === "subheadline") {
      ensureGroup("text", "Text");
      current!.items.push({ entry, index });
      continue;
    }

    if (entry.kind === "device") {
      ensureGroup("devices", "Devices");
      current!.items.push({ entry, index });
      continue;
    }

    if (entry.kind === "overlay") {
      ensureGroup("front", "In front");
      current!.items.push({ entry, index });
    }
  }

  return groups.filter((group) => group.items.length > 0);
};

const LayerIcon = ({ entry }: { entry: LayerEntry }) => {
  if (entry.kind === "headline" || entry.kind === "subheadline") {
    return <Type className="h-3.5 w-3.5 shrink-0 text-zinc-500" />;
  }
  if (entry.kind === "device") {
    return <Smartphone className="h-3.5 w-3.5 shrink-0 text-zinc-500" />;
  }
  return <ImageIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />;
};

const overlayLabel = (entry: LayerEntry, screenshot: Screenshot) => {
  if (entry.kind !== "overlay") return entry.label;
  const image = screenshot.overlayImages.find((item) => item.id === entry.id);
  const index =
    screenshot.overlayImages
      .filter((item) =>
        entry.layer === "behind"
          ? item.layer === "behind"
          : item.layer !== "behind",
      )
      .findIndex((item) => item.id === entry.id) + 1;
  return image ? `Asset ${index}` : entry.label;
};

export const UnifiedLayersPanel = ({
  screenshot,
  layers,
  selectedKey,
  dragIndex,
  dropIndex,
  onSelect,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleOverlayLayer,
  onToggleHidden,
  onToggleLocked,
  onAddAsset,
}: UnifiedLayersPanelProps) => {
  const groups = buildLayerGroups(layers);
  const draggableCount = layers.filter(
    (entry) => entry.kind !== "headline" && entry.kind !== "subheadline",
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Layers
          </h3>
          <p className="mt-1 text-[11px] text-zinc-600">
            {layers.length} layer{layers.length === 1 ? "" : "s"} · back to
            front
          </p>
        </div>
        <button
          type="button"
          onClick={onAddAsset}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-400 ring-1 ring-white/[0.08] transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Asset
        </button>
      </div>

      {draggableCount > 1 && (
        <p className="text-[11px] leading-relaxed text-zinc-600">
          Drag devices and assets to reorder. Use eye and lock to hide or pin
          layers while editing.
        </p>
      )}

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 px-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                {group.label}
              </span>
              {group.hint && (
                <span className="text-[10px] text-zinc-700">{group.hint}</span>
              )}
            </div>

            <div className="space-y-0.5">
              {group.items.map(({ entry, index }) => {
                const key = entryKey(entry);
                const isSelected = selectedKey === key;
                const isDragging = dragIndex === index;
                const isDropTarget =
                  dropIndex === index &&
                  dragIndex !== null &&
                  dragIndex !== index;
                const locked = isLayerLocked(screenshot, entry);
                const hidden = isLayerHidden(screenshot, entry);
                const overlay =
                  entry.kind === "overlay"
                    ? screenshot.overlayImages.find(
                        (item) => item.id === entry.id,
                      )
                    : null;

                return (
                  <div
                    key={key}
                    draggable={!locked}
                    onDragStart={() => !locked && onDragStart(index)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (!locked) onDragOver(index);
                    }}
                    onDragEnd={onDragEnd}
                    className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors ${
                      isSelected
                        ? "bg-violet-500/15 ring-1 ring-violet-500/30"
                        : isDropTarget
                          ? "bg-white/[0.06] ring-1 ring-white/20"
                          : "hover:bg-white/[0.03]"
                    } ${isDragging ? "opacity-35" : ""} ${hidden ? "opacity-45" : ""}`}
                  >
                    <span className="flex w-3.5 shrink-0 items-center justify-center">
                      {locked ? (
                        <Lock className="h-3 w-3 text-zinc-600" />
                      ) : (
                        <GripVertical className="h-3.5 w-3.5 cursor-grab text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing" />
                      )}
                    </span>

                    {overlay?.src ? (
                      <img
                        src={overlay.src}
                        alt=""
                        className="h-7 w-7 shrink-0 rounded object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/[0.04] ring-1 ring-white/[0.06]">
                        <LayerIcon entry={entry} />
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelect(entry)}
                      className="min-w-0 flex-1 truncate text-left text-[13px] text-zinc-200"
                    >
                      {entry.kind === "overlay"
                        ? overlayLabel(entry, screenshot)
                        : entry.label}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleHidden(entry)}
                      title={hidden ? "Show layer" : "Hide layer"}
                      className="shrink-0 rounded p-0.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
                    >
                      {hidden ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleLocked(entry)}
                      title={locked ? "Unlock layer" : "Lock layer"}
                      className="shrink-0 rounded p-0.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
                    >
                      {locked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <LockOpen className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>

                    {entry.kind === "overlay" && (
                      <button
                        type="button"
                        onClick={() => onToggleOverlayLayer(entry.id)}
                        title={
                          entry.layer === "behind"
                            ? "Move in front of device"
                            : "Move behind device"
                        }
                        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
                      >
                        {entry.layer === "behind" ? "Behind" : "Front"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { entryKey as layerEntryKey };
