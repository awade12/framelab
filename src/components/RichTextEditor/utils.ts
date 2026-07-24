/**
 * RichTextEditor Utility Functions
 */

import type { ActiveStyles, CaseTransform } from "./types";

export const isContentEmpty = (html: string | undefined): boolean => {
  if (!html) return true;
  const text = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
  return text.length === 0;
};

export const getPlainTextLength = (html: string | undefined): number => {
  if (!html) return 0;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  return (doc.body.textContent ?? "").replace(/\u00a0/g, " ").trimEnd().length;
};

export const getActiveStyles = (): ActiveStyles => ({
  bold: document.queryCommandState("bold"),
  italic: document.queryCommandState("italic"),
  underline: document.queryCommandState("underline"),
  strikethrough: document.queryCommandState("strikeThrough"),
  alignLeft: document.queryCommandState("justifyLeft"),
  alignCenter: document.queryCommandState("justifyCenter"),
  alignRight: document.queryCommandState("justifyRight"),
});

export const executeCommand = (command: string, value?: string): void => {
  if (command === "hiliteColor" && value) {
    document.execCommand("styleWithCSS", false, "true");
    const applied = document.execCommand("hiliteColor", false, value);
    if (!applied) {
      document.execCommand("backColor", false, value);
    }
    document.execCommand("styleWithCSS", false, "false");
    return;
  }

  if (command === "removeHighlight") {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("hiliteColor", false, "transparent");
    document.execCommand("styleWithCSS", false, "false");
    return;
  }

  document.execCommand(command, false, value);
};

const toTitleCase = (value: string): string =>
  value.replace(/\w\S*/g, (word) => {
    const first = word.charAt(0).toUpperCase();
    return first + word.slice(1).toLowerCase();
  });

export const transformCase = (value: string, mode: CaseTransform): string => {
  if (mode === "upper") return value.toUpperCase();
  if (mode === "lower") return value.toLowerCase();
  return toTitleCase(value);
};

export const transformSelectionCase = (mode: CaseTransform): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }

  const text = selection.toString();
  if (!text) return false;

  return document.execCommand("insertText", false, transformCase(text, mode));
};

export const normalizeHex = (color: string): string => {
  const value = color.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(value)) return value;
  if (/^#[0-9a-f]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  const rgb = value.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );
  if (!rgb) return value;

  const toHex = (part: string) =>
    Number(part).toString(16).padStart(2, "0");
  return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
};
