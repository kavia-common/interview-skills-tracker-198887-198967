import React from "react";

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme, onReset }) {
  /** Top navigation bar with global actions. */
  return (
    <header className="navbar">
      <div className="navbarInner">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandTitle">Interview Prep Tracker</div>
            <div className="brandSubtitle">Track progress. Hit targets. Stay consistent.</div>
          </div>
        </div>

        <div className="navActions">
          <button className="btn btnGhost" type="button" onClick={onReset}>
            Reset data
          </button>
          <button
            className="btn"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </div>
    </header>
  );
}
