import { demo } from "@/api/demo";
import { Card, PageHeader } from "@/components/Card";

const STATE: Record<string, { label: string; bg: string; fg: string }> = {
  Valid:        { label: "Valid",         bg: "var(--green-soft)", fg: "var(--green)" },
  ExpiringSoon: { label: "Expiring soon", bg: "var(--amber-soft)", fg: "var(--amber)" },
  Expired:      { label: "Expired",       bg: "var(--red-soft)",   fg: "var(--red)" },
};

export function EvidencePage() {
  const items = demo.evidence;
  const expiring = items.filter((e) => e.state !== "Valid").length;
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="Evidence Library" subtitle={`${items.length} files tagged to controls · ${expiring} need attention`} />
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left", color: "var(--text-secondary)" }}>
            <th style={th}>File</th><th style={th}>Control</th><th style={th}>Owner</th><th style={th}>Uploaded</th><th style={th}>Expires</th><th style={th}>Status</th>
          </tr></thead>
          <tbody>
            {items.map((e) => {
              const s = STATE[e.state];
              return (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={td}>{e.name} <span style={{ color: "var(--text-tertiary)" }}>· {(e.sizeKb/1024).toFixed(1)} MB</span></td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{e.control}</td>
                  <td style={td}>{e.owner}</td>
                  <td style={td}>{e.uploaded}</td>
                  <td style={td}>{e.expires}</td>
                  <td style={td}><span style={{ background: s.bg, color: s.fg, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{s.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
const th: React.CSSProperties = { padding: "8px 10px", fontSize: 12, fontWeight: 600 };
const td: React.CSSProperties = { padding: "8px 10px" };
