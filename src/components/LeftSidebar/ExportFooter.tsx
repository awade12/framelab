import { useRef } from "react";
import type { ExportQuality, ExportScope, ExportSize } from "../../types";
import { getOutputDimensions } from "../../lib/export-sizes";
import { STYLES } from "./constants";

interface ExportFooterProps {
  exportSizes: ExportSize[];
  selectedSizeId: string;
  exportQuality: ExportQuality;
  exportScope: ExportScope;
  exportCount: number;
  isExporting: boolean;
  onExportScopeChange: (scope: ExportScope) => void;
  onExport: () => void;
  onSaveProject: () => void;
  onImportProject: (file: File) => Promise<void>;
}

const SCOPE_OPTIONS: { id: ExportScope; label: string }[] = [
  { id: "all", label: "All screens" },
  { id: "active", label: "Active screen" },
  { id: "checked", label: "Checked screens" },
];

export const ExportFooter = ({
  exportSizes,
  selectedSizeId,
  exportQuality,
  exportScope,
  exportCount,
  isExporting,
  onExportScopeChange,
  onExport,
  onSaveProject,
  onImportProject,
}: ExportFooterProps) => {
  const importInputRef = useRef<HTMLInputElement>(null);
  const selectedSize =
    exportSizes.find((size) => size.id === selectedSizeId) ?? exportSizes[0];
  const { width, height } = getOutputDimensions(selectedSize, exportQuality);

  const handleImportChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      await onImportProject(file);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not open project file.";
      window.alert(message);
    }
  };

  const exportLabel =
    exportScope === "all"
      ? `Export all (${exportCount})`
      : exportScope === "active"
        ? "Export active screen"
        : `Export checked (${exportCount})`;

  return (
    <div className={STYLES.footer}>
      <p className="mb-2.5 text-[11px] text-zinc-600">
        {selectedSize.appStore
          ? "Exact App Store pixels"
          : `${width.toLocaleString()}×${height.toLocaleString()} PNG`}
        {" · export includes "}
        <span className="text-zinc-500">.framelab</span>
      </p>

      <label className="mb-2 block text-[11px] text-zinc-500">Export scope</label>
      <div className="mb-3 grid grid-cols-1 gap-1">
        {SCOPE_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onExportScopeChange(id)}
            className={`rounded-md px-2 py-1.5 text-left text-[11px] transition-colors ${
              exportScope === id
                ? "bg-white/10 text-white ring-1 ring-white/15"
                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onExport}
        disabled={isExporting || exportCount === 0}
        className={STYLES.primaryButton}
      >
        {isExporting ? "Exporting…" : exportLabel}
      </button>
      <button
        type="button"
        onClick={onSaveProject}
        className={`${STYLES.ghostLink} mt-2 w-full py-2 text-center text-[12px] ring-1 ring-white/[0.08] rounded-md hover:ring-white/15`}
      >
        Save project (.framelab)
      </button>
      <input
        ref={importInputRef}
        type="file"
        accept=".framelab,.zip,application/zip"
        className="hidden"
        onChange={handleImportChange}
      />
      <button
        type="button"
        onClick={() => importInputRef.current?.click()}
        className={`${STYLES.ghostLink} mt-2 w-full py-2 text-center text-[12px]`}
      >
        Open project…
      </button>
    </div>
  );
};
