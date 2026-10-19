import React, { useRef, useState } from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";

/* ─────────────────────────────────────────────────────────
   Lightweight rich-text editor: Bold / Italic / Underline.

   - Stores plain HTML (<p>, <br>, <b>, <i>, <u>) in the parent state.
   - Existing plain-text values are converted to <p> blocks on mount,
     so old records keep their line breaks and blank lines.
   - Uncontrolled on purpose: the initial HTML is captured once, so React
     never rewrites innerHTML while the user is typing (no caret jumps).
───────────────────────────────────────────────────────── */

const escapeHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const looksLikeHtml = (value) =>
  /<\/?(p|div|br|b|strong|i|em|u|ul|ol|li|span)\b/i.test(value || "");

export const plainTextToHtml = (value) => {
  if (!value) return "";
  if (looksLikeHtml(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((block) => block.replace(/^\n+|\n+$/g, ""))
    .filter((block) => block.trim())
    .map(
      (block) =>
        `<p>${block
          .split("\n")
          .map((line) => escapeHtml(line))
          .join("<br>")}</p>`
    )
    .join("");
};

const RichTextEditor = ({ value, onChange, placeholder = "", minHeight = 200 }) => {
  const areaRef = useRef(null);
  // Captured once on mount — keeps the DOM untouched during typing.
  const [initialHtml] = useState(() => plainTextToHtml(value));
  const [active, setActive] = useState({ bold: false, italic: false, underline: false });

  const syncActive = () => {
    try {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    } catch (e) {
      /* queryCommandState can throw in some browsers */
    }
  };

  const emit = () => {
    const el = areaRef.current;
    if (!el) return;
    const html = el.innerHTML;
    // Browsers leave "<br>" behind when everything is deleted.
    onChange(html === "<br>" || html === "<div><br></div>" ? "" : html);
  };

  const exec = (command) => {
    const el = areaRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, null);
    emit();
    syncActive();
  };

  const buttons = [
    { cmd: "bold", label: "Bold", icon: <FaBold /> },
    { cmd: "italic", label: "Italic", icon: <FaItalic /> },
    { cmd: "underline", label: "Underline", icon: <FaUnderline /> },
  ];

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        {buttons.map((b) => (
          <button
            key={b.cmd}
            type="button"
            className={`rte-btn${active[b.cmd] ? " is-on" : ""}`}
            title={b.label}
            aria-label={b.label}
            aria-pressed={!!active[b.cmd]}
            // keep the text selection when clicking the toolbar
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(b.cmd)}
          >
            {b.icon}
          </button>
        ))}
        <span className="rte-hint">Select text, then click Bold / Italic / Underline</span>
      </div>

      <div
        ref={areaRef}
        className="rte-area"
        style={{ minHeight }}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        onInput={emit}
        onKeyUp={syncActive}
        onMouseUp={syncActive}
        onBlur={syncActive}
      />
    </div>
  );
};

export default RichTextEditor;
