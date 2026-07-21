import { demo } from "@/api/demo";
import { StatusBadge } from "@/components/StatusBadge";
import type { ControlStatus } from "@/api/controls";
import { useAuth } from "@/stores/authStore";

const TITLE: Record<string, string> = {
  Admin: "Compliance Dashboard",
  ComplianceOfficer: "Compliance Dashboard",
  DepartmentLead: "My Compliance Area",
  Auditor: "Audit Overview",
  Executive: "Executive Summary",
};

/** Role-aware landing screen — each role sees a view scoped to what they actually own or need. */
export function DashboardPage() {
  const user = useAuth((s) => s.user)!;
  const { company, frameworks, risks, tasks, audits, controls, evidence } = demo;

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div>
        <h1 style={{ fontSize: 22, margin: 0 }}>{TITLE[user.role]}</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          {company.name} · {user.name} · {user.title}
        </p>
      </div>
    </div>
  );

  if (user.role === "DepartmentLead") {
    const myControls = controls.filter((c) => c.owner === user.name);
    const myRisks = risks.filter((r) => r.owner === user.name);
    const myTasks = tasks.filter((t) => t.assignee === user.name);
    const myEvidence = evidence.filter((e) => e.owner === user.name);
    const myCompliant = myControls.filter((c) => c.status === "Compliant").length;
    const myReadiness = myControls.length ? Math.round((myCompliant / myControls.length) * 100) : 0;

    return (
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {header}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "16px 0 24px" }}>
          <Kpi label="My readiness" value={`${myReadiness}%`} accent="var(--green)" />
          <Kpi label="My controls" value={String(myControls.length)} accent="var(--accent)" />
          <Kpi label="My open tasks" value={String(myTasks.filter((t) => t.status !== "Done").length)} accent="var(--amber)" />
          <Kpi label="My evidence" value={String(myEvidence.length)} accent="var(--blue)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="My controls">
            <Rows empty="No controls assigned to you.">
              {myControls.map((c) => (
                <tr key={c.code} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{c.code}</td>
                  <td style={{ padding: "8px 4px" }}>{c.title}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right" }}><StatusBadge status={c.status as ControlStatus} /></td>
                </tr>
              ))}
            </Rows>
          </Card>

          <Card title="My risks">
            <Rows empty="No risks assigned to you.">
              {myRisks.map((r) => (
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
            </Rows>
          </Card>
        </div>

        <div style={{ marginTop: 16 }}>
          <Card title="My tasks">
            <Rows empty="No tasks assigned to you.">
              {myTasks.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px" }}>{t.title}</td>
                  <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>{t.due}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <StatusBadge status={mapTask(t.status)} />
                  </td>
                </tr>
              ))}
            </Rows>
          </Card>
        </div>
      </div>
    );
  }

  if (user.role === "Auditor") {
    const atRisk = evidence.filter((e) => e.state !== "Valid");
    const totalFindings = audits.reduce((s, a) => s + a.findings, 0);
    const completed = audits.filter((a) => a.status === "Completed").length;

    return (
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {header}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "16px 0 24px" }}>
          <Kpi label="Upcoming audits" value={String(audits.filter((a) => a.status === "Upcoming").length)} accent="var(--blue)" />
          <Kpi label="Completed audits" value={String(completed)} accent="var(--accent)" />
          <Kpi label="Total findings" value={String(totalFindings)} accent="var(--amber)" />
          <Kpi label="Evidence needing attention" value={String(atRisk.length)} accent="var(--red)" />
        </div>

        <Card title="Audit trail">
          <Rows empty="No audits recorded.">
            {audits.map((a) => (
              <tr key={a.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 4px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{a.id}</td>
                <td style={{ padding: "8px 4px" }}>{a.name}</td>
                <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>{a.auditor}</td>
                <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>{a.date}</td>
                <td style={{ padding: "8px 4px", textAlign: "right" }}>{a.findings} findings</td>
              </tr>
            ))}
          </Rows>
        </Card>

        <div style={{ marginTop: 16 }}>
          <Card title="Evidence needing attention">
            <Rows empty="Everything is valid — nothing expiring or expired.">
              {atRisk.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px" }}>{e.name}</td>
                  <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>{e.control}</td>
                  <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>expires {e.expires}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right" }}>
                    <span style={{
                      background: e.state === "Expired" ? "var(--red-soft)" : "var(--amber-soft)",
                      color: e.state === "Expired" ? "var(--red)" : "var(--amber)",
                      padding: "2px 8px", borderRadius: 999, fontWeight: 600, fontSize: 12,
                    }}>{e.state}</span>
                  </td>
                </tr>
              ))}
            </Rows>
          </Card>
        </div>
      </div>
    );
  }

  if (user.role === "Executive") {
    const totalControls = frameworks.reduce((s, f) => s + f.controls, 0);
    const compliant = frameworks.reduce((s, f) => s + f.compliant, 0);
    const readiness = Math.round((compliant / totalControls) * 100);
    const openTasks = tasks.filter((t) => t.status !== "Done").length;
    const upcoming = audits.filter((a) => a.status === "Upcoming").length;
    const byCategory = new Map<string, { count: number; exposure: number }>();
    for (const r of risks) {
      const cur = byCategory.get(r.category) ?? { count: 0, exposure: 0 };
      cur.count += 1;
      cur.exposure += r.likelihood * r.impact;
      byCategory.set(r.category, cur);
    }

    return (
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        {header}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "16px 0 24px" }}>
          <Kpi label="Overall readiness" value={`${readiness}%`} accent="var(--green)" />
          <Kpi label="Controls tracked" value={String(totalControls)} accent="var(--accent)" />
          <Kpi label="Open tasks" value={String(openTasks)} accent="var(--amber)" />
          <Kpi label="Upcoming audits" value={String(upcoming)} accent="var(--blue)" />
        </div>

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

        <div style={{ marginTop: 16 }}>
          <Card title="Risk exposure by category">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...byCategory.entries()].sort((a, b) => b[1].exposure - a[1].exposure).map(([category, v]) => (
                <div key={category} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{category} <span style={{ color: "var(--text-tertiary)" }}>· {v.count} risk{v.count > 1 ? "s" : ""}</span></span>
                  <span style={{
                    background: "var(--red-soft)", color: "var(--red)", padding: "2px 10px",
                    borderRadius: 999, fontWeight: 600, fontFamily: "var(--font-mono)",
                  }}>{v.exposure}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Admin & ComplianceOfficer — full company-wide operational view.
  const totalControls = frameworks.reduce((s, f) => s + f.controls, 0);
  const compliant = frameworks.reduce((s, f) => s + f.compliant, 0);
  const readiness = Math.round((compliant / totalControls) * 100);
  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const topRisks = [...risks].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact).slice(0, 4);
  const upcoming = audits.filter((a) => a.status === "Upcoming").length;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {header}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "16px 0 24px" }}>
        <Kpi label="Overall readiness" value={`${readiness}%`} accent="var(--green)" />
        <Kpi label="Controls tracked" value={String(totalControls)} accent="var(--accent)" />
        <Kpi label="Open tasks" value={String(openTasks)} accent="var(--amber)" />
        <Kpi label="Upcoming audits" value={String(upcoming)} accent="var(--blue)" />
      </div>

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
          <Rows empty="No risks recorded.">
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
          </Rows>
        </Card>

        <Card title="Tasks in flight">
          <Rows empty="No open tasks.">
            {tasks.filter((t) => t.status !== "Done").slice(0, 5).map((t) => (
              <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 4px" }}>{t.title}</td>
                <td style={{ padding: "8px 4px", textAlign: "right", whiteSpace: "nowrap" }}>
                  <StatusBadge status={mapTask(t.status)} />
                </td>
              </tr>
            ))}
          </Rows>
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

function Rows({ children, empty }: { children: React.ReactNode; empty: string }) {
  const rows = Array.isArray(children) ? children : [children];
  const hasRows = rows.filter(Boolean).length > 0;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <tbody>
        {hasRows ? children : (
          <tr><td style={{ padding: "8px 4px", color: "var(--text-tertiary)" }}>{empty}</td></tr>
        )}
      </tbody>
    </table>
  );
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
