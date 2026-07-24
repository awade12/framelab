import type { RefObject, KeyboardEvent } from "react";
import { STYLES } from "./constants";

interface EditorContentProps {
  editorRef: RefObject<HTMLDivElement | null>;
  placeholder: string;
  isEmpty: boolean;
  characterCount: number;
  size?: "sm" | "md" | "lg";
  onInput: () => void;
  onBlur: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const editorSizeClass = {
  sm: STYLES.editorSm,
  md: STYLES.editorMd,
  lg: STYLES.editorLg,
} as const;

const placeholderSizeClass = {
  sm: STYLES.placeholderSm,
  md: STYLES.placeholderMd,
  lg: STYLES.placeholderLg,
} as const;

export const EditorContent = ({
  editorRef,
  placeholder,
  isEmpty,
  characterCount,
  size = "md",
  onInput,
  onBlur,
  onKeyDown,
}: EditorContentProps) => (
  <div className="relative">
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={onInput}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`${STYLES.editor} ${editorSizeClass[size]}`}
      data-placeholder={placeholder}
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    />
    {isEmpty && (
      <div className={`${STYLES.placeholder} ${placeholderSizeClass[size]}`}>
        {placeholder}
      </div>
    )}
    <div className={STYLES.footer}>
      <span>Select text to format</span>
      <span className="tabular-nums">
        {characterCount} {characterCount === 1 ? "char" : "chars"}
      </span>
    </div>
  </div>
);
