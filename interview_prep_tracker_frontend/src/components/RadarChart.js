import React, { useMemo } from "react";

/**
 * Convert polar coordinates to cartesian point.
 * Angle is in radians, 0 points "up" (negative y).
 */
function polarToCartesian(cx, cy, radius, angleRad) {
  const x = cx + radius * Math.sin(angleRad);
  const y = cy - radius * Math.cos(angleRad);
  return { x, y };
}

function clamp0to100(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function buildPolygonPoints({ cx, cy, rMax, angles, values }) {
  return angles
    .map((angle, idx) => {
      const v = clamp0to100(values[idx]);
      const r = (v / 100) * rMax;
      const p = polarToCartesian(cx, cy, r, angle);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(" ");
}

// PUBLIC_INTERFACE
export default function RadarChart({ labels, values, targetValues }) {
  /** Radar chart for 3 skills using custom SVG (no chart dependencies). */
  const size = 320;
  const padding = 44;
  const cx = size / 2;
  const cy = size / 2 + 6; // slight down to improve label room at top
  const rMax = cx - padding;

  // With 3 axes, place first axis at 0° (up), then 120°, 240°.
  const angles = useMemo(() => {
    const step = (2 * Math.PI) / labels.length;
    return labels.map((_, i) => i * step);
  }, [labels]);

  const gridRadii = useMemo(() => [0.25, 0.5, 0.75, 1].map((t) => t * rMax), [rMax]);

  const dataPoints = useMemo(
    () => buildPolygonPoints({ cx, cy, rMax, angles, values }),
    [cx, cy, rMax, angles, values]
  );

  const targetPoints = useMemo(() => {
    if (!targetValues) return null;
    return buildPolygonPoints({ cx, cy, rMax, angles, values: targetValues });
  }, [cx, cy, rMax, angles, targetValues]);

  const labelPositions = useMemo(() => {
    // Place labels a bit beyond rMax and adjust with small offsets.
    return labels.map((label, i) => {
      const p = polarToCartesian(cx, cy, rMax + 22, angles[i]);
      // Small manual nudges for nicer alignment on 3-point chart
      const isTop = i === 0;
      const isRight = i === 1;
      const isLeft = i === 2;
      return {
        label,
        x: p.x + (isRight ? 10 : isLeft ? -10 : 0),
        y: p.y + (isTop ? -4 : 6),
        anchor: isRight ? "start" : isLeft ? "end" : "middle",
      };
    });
  }, [labels, cx, cy, rMax, angles]);

  return (
    <div className="radarCard" role="group" aria-label="Skill radar chart">
      <div className="radarHeader">
        <h2 className="sectionTitle">Skill Radar</h2>
        <p className="sectionSubtitle">Current vs target progress across core areas.</p>
      </div>

      <div className="radarWrap">
        <svg
          className="radarSvg"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Radar chart showing progress for DSA, System Design, and Frontend"
        >
          {/* Grid */}
          {gridRadii.map((r, idx) => (
            <polygon
              // For a 3-axis radar, grid polygons are triangles
              key={idx}
              points={buildPolygonPoints({
                cx,
                cy,
                rMax: r,
                angles,
                values: new Array(labels.length).fill(100),
              })}
              className="radarGrid"
            />
          ))}

          {/* Axis lines */}
          {angles.map((angle, idx) => {
            const p = polarToCartesian(cx, cy, rMax, angle);
            return (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                className="radarAxis"
              />
            );
          })}

          {/* Target polygon (optional) */}
          {targetPoints ? <polygon points={targetPoints} className="radarTarget" /> : null}

          {/* Current polygon */}
          <polygon points={dataPoints} className="radarData" />

          {/* Data points */}
          {angles.map((angle, idx) => {
            const v = clamp0to100(values[idx]);
            const p = polarToCartesian(cx, cy, (v / 100) * rMax, angle);
            return <circle key={idx} cx={p.x} cy={p.y} r="4" className="radarDot" />;
          })}

          {/* Labels */}
          {labelPositions.map((lp) => (
            <text
              key={lp.label}
              x={lp.x}
              y={lp.y}
              textAnchor={lp.anchor}
              className="radarLabel"
            >
              {lp.label}
            </text>
          ))}
        </svg>

        <div className="radarLegend" aria-label="Chart legend">
          <div className="legendItem">
            <span className="legendSwatch legendCurrent" aria-hidden="true" />
            <span>Current</span>
          </div>
          {targetValues ? (
            <div className="legendItem">
              <span className="legendSwatch legendTarget" aria-hidden="true" />
              <span>Target</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
