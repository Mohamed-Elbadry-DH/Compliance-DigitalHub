import { demo } from "@/api/demo";
import { StatusBadge } from "@/components/StatusBadge";
import type { ControlStatus } from "@/api/controls";

/** Executive readiness view for Digital Hub — the demo's headline screen. */
export function DashboardPage() {
  const { company, frameworks, risks, tasks, audits } = demo;

  const totalControls = frameworks.reduce((s, f) => s + f.controls, 0);
  const compliant = frameworks.reduce((s, f) => s + f.compliant, 0);
  const readiness = Math.round((compliant / totalControls) * 100);
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const topRisks = [...risks].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact).slice(0, 4);
  const upcoming = audits.filter((a) => a.status === "Upcoming").length;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Compliance Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {company.name} · {company.industry} · {company.employees} employees · {company.hq}
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "16px 0 24px" }}>
        <Kpi label="Overall readiness" value={`${readiness}%`} accent="var(--green)" />
        <Kpi label="Controls tracked" value={String(totalControls)} accent="var(--accent)" />
        <Kpi label="Open tasks" value={String(openTasks)} accent="var(--amber)" />
        <Kpi label="Upcoming audits" value={String(upcoming)} accent="var(--blue)" />
      </div>

      {/* Framework readiness bars */}
      <Card title="Framework readiness">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {frameworks.map((f) => {
            const pct = Math.round((f.compliant / f.controls) * 100);
            return (
              <div key={f.slug}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span><strong>{f.code}</strong> · {f.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: "var(--bg-sunken)", borderRadius: 999 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: f.color, borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card title="Top risks">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {topRisks.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{r.id}</td>
                  <td style={{ padding: "8px 4px" }}>{r.title}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right" }}>
                    <span style={{ background: "var(--red-soft)", color: "var(--red)", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                      {r.likelihood * r.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Tasks in flight">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {tasks.filter((t) => t.status !== "Done").slice(0, 5).map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px" }}>{t.title}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <StatusBadge status={mapTask(t.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function mapTask(s: string): ControlStatus {
  if (s === "Done") return "Compliant";
  if (s === "Blocked") return "Gap";
  return "InProgress";
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}
