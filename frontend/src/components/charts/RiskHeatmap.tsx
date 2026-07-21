import { Fragment, useState } from "react";
import { sequentialColor } from "@/lib/palette";

export interface HeatmapRisk {
  id: string;
  title: string;
  likelihood: number; // 1–5
  impact: number; // 1–5
}

/** Compare-magnitude-on-a-grid job → heatmap, sequential color (one hue, more-is-darker). */
export function RiskHeatmap({ risks }: { risks: HeatmapRisk[] }) {
  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const size = 5;

  const cells = new Map<string, HeatmapRisk[]>();
  for (const r of risks) {
    const key = `${r.likelihood}-${r.impact}`;
    const list = cells.get(key) ?? [];
    list.push(r);
    cells.set(key, list);
  }
  const maxCount = Math.max(1, ...[...cells.values()].map((v) => v.length));

  const likelihoods = [5, 4, 3, 2, 1]; // top → bottom
  const impacts = [1, 2, 3, 4, 5]; // left → right

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginRight: 8, fontSize: 11, color: "var(--text-tertiary)" }}>
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Likelihood →
          </span>
        </div>

        <div style={{ maxWidth: 340 }}>
          <div style={{ display: "grid", gridTemplateColumns: `24px repeat(${size}, 44px)`, gap: 3 }}>
            {likelihoods.map((l) => (
              <Fragment key={`row-${l}`}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--text-tertiary)" }}>{l}</div>
                {impacts.map((i) => {
                  const key = `${l}-${i}`;
                  const items = cells.get(key) ?? [];
                  const ratio = items.length / maxCount;
                  const bg = items.length ? sequentialColor(0.25 + ratio * 0.75) : "var(--bg-sunken)";
                  const isDark = items.length > 0 && ratio > 0.5;
                  return (
                    <div
                      key={key}
                      role="img"
                      aria-label={`Likelihood ${l}, impact ${i}: ${items.length} risk${items.length === 1 ? "" : "s"}`}
                      tabIndex={items.length ? 0 : -1}
                      onMouseEnter={() => items.length && setHoverCell(key)}
                      onMouseLeave={() => setHoverCell(null)}
                      onFocus={() => items.length && setHoverCell(key)}
                      onBlur={() => setHoverCell(null)}
                      style={{
                        position: "relative", width: 44, height: 44, borderRadius: 5, background: bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, color: isDark ? "#fff" : "var(--text-secondary)",
                        cursor: items.length ? "default" : "default", outline: "none",
                        transition: "outline 120ms ease",
                      }}
                    >
                      {items.length > 0 ? items.length : ""}
                      {hoverCell === key && (
                        <div style={{
                          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                          background: "var(--text)", color: "#fff", fontSize: 12, padding: "8px 10px", borderRadius: 6,
                          whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none",
                        }}>
                          {items.map((r) => (
                            <div key={r.id}>{r.id} · {r.title}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
            <div />
            {impacts.map((i) => (
              <div key={`i-${i}`} style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>{i}</div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Impact →</div>
        </div>
      </div>
    </div>
  );
}
