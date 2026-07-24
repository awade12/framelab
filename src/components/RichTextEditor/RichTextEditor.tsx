import type { RichTextEditorProps } from "./types";
import { STYLES } from "./constants";
import { useRichTextEditor } from "./useRichTextEditor";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Type something...",
  className = "",
  size = "md",
}: RichTextEditorProps) => {
  const {
    editorRef,
    textColor,
    backgroundColor,
    isEmpty,
    characterCount,
    activeStyles,
    execCommand,
    handleInput,
    handleColorChange,
    handleBackgroundColorChange,
    handleClearHighlight,
    handleCaseTransform,
    handleKeyDown,
    triggerChange,
  } = useRichTextEditor({ value, onChange });

  return (
    <div className={`${STYLES.container} ${className}`}>
      <EditorToolbar
        activeStyles={activeStyles}
        textColor={textColor}
        backgroundColor={backgroundColor}
        onCommand={execCommand}
        onColorChange={handleColorChange}
        onBackgroundColorChange={handleBackgroundColorChange}
        onClearHighlight={handleClearHighlight}
        onCaseTransform={handleCaseTransform}
      />
      <EditorContent
        editorRef={editorRef}
        placeholder={placeholder}
        isEmpty={isEmpty}
        characterCount={characterCount}
        size={size}
        onInput={handleInput}
        onBlur={triggerChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
