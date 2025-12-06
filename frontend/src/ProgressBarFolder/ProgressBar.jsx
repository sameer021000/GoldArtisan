// ProgressBar.jsx
import React, { useEffect } from "react";
import "./ProgressBar.css";

/**
 * Props:
 *  - visible: boolean (show/hide)
 *  - progress: number (0-100) optional; if omitted the component uses internal animated stripe
 *  - label: string optional text shown above progress
 *  - onFinished: callback when progress reaches 100 (optional)
 */
export default function ProgressBar({ visible = false, progress = null, label = "", onFinished }) {
  useEffect(() => {
    if (!visible) return;
    if (progress === 100 && typeof onFinished === "function") {
      // give a tiny delay so the user sees 100%
      const t = setTimeout(() => onFinished(), 300);
      return () => clearTimeout(t);
    }
  }, [visible, progress, onFinished]);

  if (!visible) return null;

  const pct = typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : null;

  return (
    <div className="progress-container" role="status" aria-live="polite" aria-label={label || "Uploading"}>
      {label ? <div className="progress-text">{label}</div> : null}
      <div className="progress-outer" aria-hidden={false}>
        {pct !== null ? (
          <div className="progress-inner" style={{ width: `${pct}%` }} data-pct={`${pct}%`}>
            <span className="progress-label">{pct}%</span>
          </div>
        ) : (
          <div className="progress-indeterminate" />
        )}
      </div>
    </div>
  );
}
