import { demo } from "@/api/demo";
import { Card, PageHeader } from "@/components/Card";

const LIK = ["Rare", "Unlikely", "Possible", "Likely", "Almost certain"];
const IMP = ["Insignificant", "Minor", "Moderate", "Major", "Severe"];

function cellColor(score: number) {
  if (score >= 15) return "var(--red-soft)";
  if (score >= 8) return "var(--amber-soft)";
  return "var(--green-soft)";
}

export function RisksPage() {
  const risks = demo.risks;
  // map[impact][likelihood] -> risk ids
  const grid: string[][][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => [] as string[]));
  risks.forEach((r) => grid[r.impact - 1][r.likelihood - 1].push(r.id));

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="Risk Register" subtitle={`${risks.length} risks · 5×5 likelihood × impact heat map`} />

      <Card title="Heat map" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap", fontSize: 12, color: "var(--text-secondary)" }}>Impact →</span>
          </div>
          <div style={{ flex: 1 }}>
            {[4, 3, 2, 1, 0].map((row) => (
              <div key={row} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 96, fontSize: 11, color: "var(--text-secondary)", textAlign: "right", paddingRight: 6, alignSelf: "center" }}>{IMP[row]}</div>
                {[0, 1, 2, 3, 4].map((col) => {
                  const score = (row + 1) * (col + 1);
                  const ids = grid[row][col];
                  return (
                    <div key={col} style={{ flex: 1, minHeight: 54, background: cellColor(score), borderRadius: 8, border: "1px solid var(--border)", padding: 6, display: "flex", flexWrap: "wrap", gap: 4, alignContent: "flex-start" }}>
                      {ids.map((id) => (
                        <span key={id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, background: "var(--bg-elev)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "1px 5px" }}>{id}</span>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <div style={{ width: 96 }} />
              {LIK.map((l) => <div key={l} style={{ flex: 1, fontSize: 11, color: "var(--text-secondary)", textAlign: "center" }}>{l}</div>)}
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Likelihood →</div>
          </div>
        </div>
      </Card>

      <Card title="Register">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left", color: "var(--text-secondary)" }}>
            <th style={th}>ID</th><th style={th}>Risk</th><th style={th}>Category</th><th style={th}>Owner</th><th style={th}>Score</th><th style={th}>Treatment</th>
          </tr></thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{r.id}</td>
                <td style={td}>{r.title}</td>
                <td style={td}>{r.category}</td>
                <td style={td}>{r.owner}</td>
                <td style={td}><span style={{ background: cellColor(r.likelihood * r.impact), padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{r.likelihood * r.impact}</span></td>
                <td style={td}>{r.treatment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
const th: React.CSSProperties = { padding: "8px 10px", fontSize: 12, fontWeight: 600 };
const td: React.CSSProperties = { padding: "8px 10px" };
