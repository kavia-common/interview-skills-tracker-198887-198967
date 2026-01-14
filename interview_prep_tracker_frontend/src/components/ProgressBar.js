import React from "react";

function clamp0to100(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

// PUBLIC_INTERFACE
export default function ProgressBar({ value, label, variant = "primary" }) {
  /** Accessible progress bar with theme-aware styling. */
  const v = clamp0to100(value);

  return (
    <div className="progressBar" aria-label={label}>
      <div
        className={`progressFill ${variant === "success" ? "progressFillSuccess" : ""}`}
        style={{ width: `${v}%` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(v)}
      />
    </div>
  );
}
