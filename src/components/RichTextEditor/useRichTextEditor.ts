import { useRef, useEffect, useState, useCallback, type KeyboardEvent } from "react";
import type { ActiveStyles, CaseTransform } from "./types";
import {
  DEFAULT_ACTIVE_STYLES,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_TEXT_COLOR,
} from "./constants";
import {
  isContentEmpty,
  getActiveStyles,
  executeCommand,
  getPlainTextLength,
  transformSelectionCase,
} from "./utils";
import {
  normalizeRichTextHighlightRoot,
  normalizeRichTextHighlights,
} from "../../lib/rich-text-highlight";

interface UseRichTextEditorOptions {
  value: string;
  onChange: (html: string) => void;
}

interface UseRichTextEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  textColor: string;
  backgroundColor: string;
  isEmpty: boolean;
  characterCount: number;
  activeStyles: ActiveStyles;
  execCommand: (command: string, value?: string) => void;
  handleInput: () => void;
  handleColorChange: (color: string) => void;
  handleBackgroundColorChange: (color: string) => void;
  handleClearHighlight: () => void;
  handleCaseTransform: (mode: CaseTransform) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  triggerChange: () => void;
  updateActiveStyles: () => void;
}

export const useRichTextEditor = ({
  value,
  onChange,
}: UseRichTextEditorOptions): UseRichTextEditorReturn => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_BACKGROUND_COLOR,
  );
  const [isEmpty, setIsEmpty] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  const [activeStyles, setActiveStyles] = useState<ActiveStyles>(
    DEFAULT_ACTIVE_STYLES,
  );

  const updateActiveStyles = useCallback(() => {
    setActiveStyles(getActiveStyles());
  }, []);

  const triggerChange = useCallback(() => {
    if (editorRef.current) {
      normalizeRichTextHighlightRoot(editorRef.current);
      const html = editorRef.current.innerHTML;
      setIsEmpty(isContentEmpty(html));
      setCharacterCount(getPlainTextLength(html));
      onChange(html);
    }
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();
      executeCommand(command, commandValue);
      updateActiveStyles();
      triggerChange();
    },
    [updateActiveStyles, triggerChange],
  );

  const handleInput = useCallback(() => {
    triggerChange();
    updateActiveStyles();
  }, [triggerChange, updateActiveStyles]);

  const handleColorChange = useCallback(
    (color: string) => {
      setTextColor(color);
      execCommand("foreColor", color);
    },
    [execCommand],
  );

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color);
      execCommand("hiliteColor", color);
    },
    [execCommand],
  );

  const handleClearHighlight = useCallback(() => {
    execCommand("removeHighlight");
  }, [execCommand]);

  const handleCaseTransform = useCallback(
    (mode: CaseTransform) => {
      editorRef.current?.focus();
      if (transformSelectionCase(mode)) {
        updateActiveStyles();
        triggerChange();
      }
    },
    [triggerChange, updateActiveStyles],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      const key = event.key.toLowerCase();

      if (key === "b") {
        event.preventDefault();
        execCommand("bold");
        return;
      }
      if (key === "i") {
        event.preventDefault();
        execCommand("italic");
        return;
      }
      if (key === "u") {
        event.preventDefault();
        execCommand("underline");
        return;
      }
      if (event.shiftKey && key === "x") {
        event.preventDefault();
        execCommand("strikeThrough");
      }
    },
    [execCommand],
  );

  useEffect(() => {
    const normalizedValue = normalizeRichTextHighlights(value);

    if (
      editorRef.current &&
      editorRef.current.innerHTML !== normalizedValue
    ) {
      editorRef.current.innerHTML = normalizedValue;
      setIsEmpty(isContentEmpty(normalizedValue));
      setCharacterCount(getPlainTextLength(normalizedValue));
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && editorRef.current?.contains(selection.anchorNode)) {
        updateActiveStyles();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveStyles]);

  return {
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
    updateActiveStyles,
  };
};
