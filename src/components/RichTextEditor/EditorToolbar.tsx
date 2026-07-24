import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Palette,
  Undo2,
  Redo2,
  RemoveFormatting,
  CaseSensitive,
  CaseUpper,
  CaseLower,
} from "lucide-react";
import type { ActiveStyles, CaseTransform } from "./types";
import {
  HIGHLIGHT_COLOR_PRESETS,
  ICON_SIZE,
  STYLES,
  TEXT_COLOR_PRESETS,
} from "./constants";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarSeparator } from "./ToolbarSeparator";
import { ColorMenu } from "./ColorMenu";

interface EditorToolbarProps {
  activeStyles: ActiveStyles;
  textColor: string;
  backgroundColor: string;
  onCommand: (command: string, value?: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onClearHighlight: () => void;
  onCaseTransform: (mode: CaseTransform) => void;
}

export const EditorToolbar = ({
  activeStyles,
  textColor,
  backgroundColor,
  onCommand,
  onColorChange,
  onBackgroundColorChange,
  onClearHighlight,
  onCaseTransform,
}: EditorToolbarProps) => {
  const preventFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className={STYLES.toolbar}>
      <div className={STYLES.toolbarGroup}>
        <ToolbarButton
          onClick={() => onCommand("undo")}
          tooltip="Undo (Ctrl+Z)"
          onMouseDown={preventFocus}
        >
          <Undo2 size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("redo")}
          tooltip="Redo (Ctrl+Shift+Z)"
          onMouseDown={preventFocus}
        >
          <Redo2 size={ICON_SIZE} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className={STYLES.toolbarGroup}>
        <ToolbarButton
          onClick={() => onCommand("bold")}
          active={activeStyles.bold}
          tooltip="Bold (Ctrl+B)"
          onMouseDown={preventFocus}
        >
          <Bold size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("italic")}
          active={activeStyles.italic}
          tooltip="Italic (Ctrl+I)"
          onMouseDown={preventFocus}
        >
          <Italic size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("underline")}
          active={activeStyles.underline}
          tooltip="Underline (Ctrl+U)"
          onMouseDown={preventFocus}
        >
          <Underline size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("strikeThrough")}
          active={activeStyles.strikethrough}
          tooltip="Strikethrough (Ctrl+Shift+X)"
          onMouseDown={preventFocus}
        >
          <Strikethrough size={ICON_SIZE} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className={STYLES.toolbarGroup}>
        <ColorMenu
          value={textColor}
          presets={TEXT_COLOR_PRESETS}
          onChange={onColorChange}
          onMouseDown={preventFocus}
          tooltip="Text Color"
          icon={<Palette size={ICON_SIZE} />}
        />
        <ColorMenu
          value={backgroundColor}
          presets={HIGHLIGHT_COLOR_PRESETS}
          onChange={onBackgroundColorChange}
          onMouseDown={preventFocus}
          tooltip="Highlight Color"
          icon={<Highlighter size={ICON_SIZE} />}
          allowClear
          onClear={onClearHighlight}
        />
      </div>

      <ToolbarSeparator />

      <div className={STYLES.toolbarGroup}>
        <ToolbarButton
          onClick={() => onCommand("justifyLeft")}
          active={activeStyles.alignLeft}
          tooltip="Align Left"
          onMouseDown={preventFocus}
        >
          <AlignLeft size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("justifyCenter")}
          active={activeStyles.alignCenter}
          tooltip="Align Center"
          onMouseDown={preventFocus}
        >
          <AlignCenter size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onCommand("justifyRight")}
          active={activeStyles.alignRight}
          tooltip="Align Right"
          onMouseDown={preventFocus}
        >
          <AlignRight size={ICON_SIZE} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className={STYLES.toolbarGroup}>
        <ToolbarButton
          wide
          onClick={() => onCaseTransform("upper")}
          tooltip="UPPERCASE"
          onMouseDown={preventFocus}
        >
          <CaseUpper size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          wide
          onClick={() => onCaseTransform("lower")}
          tooltip="lowercase"
          onMouseDown={preventFocus}
        >
          <CaseLower size={ICON_SIZE} />
        </ToolbarButton>
        <ToolbarButton
          wide
          onClick={() => onCaseTransform("title")}
          tooltip="Title Case"
          onMouseDown={preventFocus}
        >
          <CaseSensitive size={ICON_SIZE} />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      <div className={STYLES.toolbarGroup}>
        <ToolbarButton
          onClick={() => onCommand("removeFormat")}
          tooltip="Clear Formatting"
          onMouseDown={preventFocus}
        >
          <RemoveFormatting size={ICON_SIZE} />
        </ToolbarButton>
      </div>
    </div>
  );
};
