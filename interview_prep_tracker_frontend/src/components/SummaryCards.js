import React from "react";

function formatPercent(n) {
  return `${Math.round(n)}%`;
}

// PUBLIC_INTERFACE
export default function SummaryCards({ overallProgress, onTrackCount, lastUpdatedAt }) {
  /** Summary metric cards shown near top of dashboard. */
  const lastUpdated = lastUpdatedAt ? new Date(lastUpdatedAt) : null;
  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "—";

  return (
    <section className="summaryGrid" aria-label="Summary metrics">
      <div className="card summaryCard">
        <div className="cardLabel">Overall Progress</div>
        <div className="cardValue">{formatPercent(overallProgress)}</div>
        <div className="cardHint">Average across your core skills.</div>
      </div>

      <div className="card summaryCard">
        <div className="cardLabel">Skills On Track</div>
        <div className="cardValue">
          {onTrackCount}
          <span className="cardValueSub">/3</span>
        </div>
        <div className="cardHint">Progress at or above target.</div>
      </div>

      <div className="card summaryCard">
        <div className="cardLabel">Last Updated</div>
        <div className="cardValue cardValueSm">{lastUpdatedLabel}</div>
        <div className="cardHint">Saved automatically to this browser.</div>
      </div>
    </section>
  );
}
