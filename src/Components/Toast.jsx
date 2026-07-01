import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

/* ─────────────────────────────────────────────────────────
   Usage:
   const [toast, setToast] = useState(null);
   showToast = (msg, type = "info") => setToast({ msg, type });

   Types: "success" | "error" | "info" | "warning"
───────────────────────────────────────────────────────── */

const ICONS = {
  success: <FaCheckCircle />,
  error:   <FaTimesCircle />,
  warning: <FaInfoCircle />,
  info:    <FaInfoCircle />,
};

const COLORS = {
  success: { bg: "#031B77", accent: "#4ade80", border: "rgba(74,222,128,0.35)" },
  error:   { bg: "#031B77", accent: "#f87171", border: "rgba(248,113,113,0.35)" },
  warning: { bg: "#031B77", accent: "#fbbf24", border: "rgba(251,191,36,0.35)" },
  info:    { bg: "#031B77", accent: "#60a5fa", border: "rgba(96,165,250,0.35)" },
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const { bg, accent, border } = COLORS[toast.type] || COLORS.info;

  return (
    <div style={{
      position: "fixed",
      top: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 999999,
      minWidth: "300px",
      maxWidth: "480px",
      width: "calc(100vw - 32px)",
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: "14px",
      boxShadow: "0 8px 40px rgba(3,27,119,0.35)",
      display: "flex",
      alignItems: "flex-start",
      gap: "14px",
      padding: "16px 18px",
      animation: "toastSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Icon */}
      <span style={{
        fontSize: "22px",
        color: accent,
        flexShrink: 0,
        marginTop: "1px",
      }}>
        {ICONS[toast.type] || ICONS.info}
      </span>

      {/* Message */}
      <span style={{
        flex: 1,
        color: "#ffffff",
        fontSize: "14.5px",
        fontWeight: 500,
        lineHeight: 1.5,
      }}>
        {toast.msg}
      </span>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          fontSize: "16px",
          cursor: "pointer",
          padding: "2px",
          flexShrink: 0,
          lineHeight: 1,
          marginTop: "2px",
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
