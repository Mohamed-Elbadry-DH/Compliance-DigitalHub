import { useState } from "react";

export interface CompositionSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  softColor: string;
}

/**
 * Part-to-whole as a single horizontal stacked bar (never a pie — see dataviz
 * anti-patterns: donuts fail at comparing close values past a couple of slices).
 * Every count is direct-labeled when it fits; legend always present for 2+ segments.
 */
export function StatusCompositionBar({ segments, title }: { segments: CompositionSegment[]; title?: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div>
      {title && <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{title}</div>}

      <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", gap: 2 }}>
        {segments.filter((s) => s.value > 0).map((s) => {
          const pct = total ? (s.value / total) * 100 : 0;
          const fits = pct > 10;
          return (
            <div
              key={s.key}
              role="img"
              aria-label={`${s.label}: ${s.value} (${Math.round(pct)}%)`}
              tabIndex={0}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.key)}
              onBlur={() => setHover(null)}
              style={{
                width: `${pct}%`, minWidth: 4, background: s.color, position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "filter 120ms ease", filter: hover === s.key ? "brightness(1.08)" : "none",
                cursor: "default", outline: "none",
              }}
            >
              {fits && (
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{s.value}</span>
              )}
              {hover === s.key && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                  background: "var(--text)", color: "#fff", fontSize: 12, padding: "6px 10px", borderRadius: 6,
                  whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none",
                }}>
                  <strong>{s.value}</strong> · {s.label} ({Math.round(pct)}%)
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend — the dependable identity channel, never color-matching alone. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10 }}>
        {segments.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: "inline-block" }} />
            {s.label} <span style={{ color: "var(--text-tertiary)" }}>· {s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
