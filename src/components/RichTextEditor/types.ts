/**
 * RichTextEditor Types
 */

export interface ActiveStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

export interface ToolbarButtonConfig {
  id: string;
  command: string;
  tooltip: string;
  activeKey?: keyof ActiveStyles;
}

export type CaseTransform = "upper" | "lower" | "title";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}
