import { useMemo, useState } from "react";
import { demo } from "@/api/demo";
import { StatusBadge } from "@/components/StatusBadge";
import type { ControlStatus } from "@/api/controls";
import { useAuth } from "@/stores/authStore";
import { STATUS, STATUS_SOFT } from "@/lib/palette";
import { FrameworkCompositionChart, type FrameworkDatum } from "@/components/charts/FrameworkCompositionChart";
import { RiskHeatmap } from "@/components/charts/RiskHeatmap";
import { CategoryBarChart, type CategoryBarDatum } from "@/components/charts/CategoryBarChart";
import { StatusCompositionBar, type CompositionSegment } from "@/components/charts/StatusCompositionBar";
import { DashboardFilters, DEFAULT_FILTERS, matchesSearch, type DashboardFilterState } from "./DashboardFilters";

const TITLE: Record<string, string> = {
  Admin: "Compliance Dashboard",
  ComplianceOfficer: "Compliance Dashboard",
  DepartmentLead: "My Compliance Area",
  Auditor: "Audit Overview",
  Executive: "Executive Summary",
};

const TASK_STATUS_STYLE: Record<string, { label: string; color: string; softColor: string }> = {
  Todo: { label: "Todo", color: STATUS.neutral, softColor: STATUS_SOFT.neutral },
  InProgress: { label: "In progress", color: STATUS.warning, softColor: STATUS_SOFT.warning },
  Blocked: { label: "Blocked", color: STATUS.critical, softColor: STATUS_SOFT.critical },
  Done: { label: "Done", color: STATUS.good, softColor: STATUS_SOFT.good },
};

const EVIDENCE_STATE_STYLE: Record<string, { label: string; color: string; softColor: string }> = {
  Valid: { label: "Valid", color: STATUS.good, softColor: STATUS_SOFT.good },
  ExpiringSoon: { label: "Expiring soon", color: STATUS.warning, softColor: STATUS_SOFT.warning },
  Expired: { label: "Expired", color: STATUS.critical, softColor: STATUS_SOFT.critical },
};

/** Role-aware, filterable landing screen — each role sees a view scoped to what they own or need. */
export function DashboardPage() {
  const user = useAuth((s) => s.user)!;
  const { company, frameworks, risks, tasks, audits, controls, evidence } = demo;
  const [filters, setFilters] = useState<DashboardFilterState>(DEFAULT_FILTERS);

  const owners = useMemo(() => demo.users.map((u) => u.name), []);
  const frameworkOptions = useMemo(() => frameworks.map((f) => ({ slug: f.slug, code: f.code })), [frameworks]);

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

  const frameworkChartData: FrameworkDatum[] = useMemo(() => (
    frameworks
      .filter((f) => filters.framework === "all" || f.slug === filters.framework)
      .map((f) => ({
        code: f.code, name: f.name, compliant: f.compliant, inProgress: f.inProgress, gap: f.gap,
        pct: Math.round((f.compliant / f.controls) * 100),
      }))
  ), [frameworks, filters.framework]);

  function scopeRisks(base = risks, owner = filters.owner) {
    return base
      .filter((r) => owner === "all" || r.owner === owner)
      .filter((r) => matchesSearch(filters.search, r.title, r.category, r.id));
  }
  function scopeTasks(base = tasks, owner = filters.owner) {
    return base
      .filter((t) => owner === "all" || t.assignee === owner)
      .filter((t) => filters.taskStatus === "all" || t.status === filters.taskStatus)
      .filter((t) => matchesSearch(filters.search, t.title, t.id));
  }
  function scopeEvidence(base = evidence, owner = filters.owner) {
    return base
      .filter((e) => owner === "all" || e.owner === owner)
      .filter((e) => matchesSearch(filters.search, e.name, e.control));
  }
  function scopeAudits(base = audits) {
    return base
      .filter((a) => filters.framework === "all" || a.framework === filters.framework)
      .filter((a) => matchesSearch(filters.search, a.name, a.auditor));
  }

  function taskCompositionSegments(list: typeof tasks): CompositionSegment[] {
    return (["Todo", "InProgress", "Blocked", "Done"] as const).map((key) => ({
      key, label: TASK_STATUS_STYLE[key].label, color: TASK_STATUS_STYLE[key].color,
      softColor: TASK_STATUS_STYLE[key].softColor, value: list.filter((t) => t.status === key).length,
    }));
  }
  function evidenceCompositionSegments(list: typeof evidence): CompositionSegment[] {
    return (["Valid", "ExpiringSoon", "Expired"] as const).map((key) => ({
      key, label: EVIDENCE_STATE_STYLE[key].label, color: EVIDENCE_STATE_STYLE[key].color,
      softColor: EVIDENCE_STATE_STYLE[key].softColor, value: list.filter((e) => e.state === key).length,
    }));
  }
  function riskCategoryData(list: typeof risks): CategoryBarDatum[] {
    const byCategory = new Map<string, { count: number; exposure: number }>();
    for (const r of list) {
      const cur = byCategory.get(r.category) ?? { count: 0, exposure: 0 };
      cur.count += 1; cur.exposure += r.likelihood * r.impact;
      byCategory.set(r.category, cur);
    }
    return [...byCategory.entries()]
      .sort((a, b) => b[1].exposure - a[1].exposure)
      .map(([name, v]) => ({ name, value: v.exposure, detail: `${v.count} risk${v.count > 1 ? "s" : ""}` }));
  }

  // ---------------- Department Lead ----------------
  if (user.role === "DepartmentLead") {
    const myControls = controls
      .filter((c) => c.owner === user.name)
      .filter((c) => filters.framework === "all" || c.framework === filters.framework)
      .filter((c) => matchesSearch(filters.search, c.title, c.code));
    const myRisks = scopeRisks(risks, user.name);
    const myTasks = scopeTasks(tasks, user.name);
    const myEvidence = scopeEvidence(evidence, user.name);
    const myCompliant = myControls.filter((c) => c.status === "Compliant").length;
    const myReadiness = myControls.length ? Math.round((myCompliant / myControls.length) * 100) : 0;

    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {header}
        <DashboardFilters
          value={filters} onChange={setFilters} frameworks={frameworkOptions}
          showOwner={false}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "0 0 16px" }}>
          <Kpi label="My readiness" value={`${myReadiness}%`} accent="var(--green)" />
          <Kpi label="My controls" value={String(myControls.length)} accent="var(--accent)" />
          <Kpi label="My open tasks" value={String(myTasks.filter((t) => t.status !== "Done").length)} accent="var(--amber)" />
          <Kpi label="My evidence" value={String(myEvidence.length)} accent="var(--blue)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
          <Card title="My risk exposure (likelihood × impact)">
            {myRisks.length ? <RiskHeatmap risks={myRisks} /> : <Empty text="No risks in this scope." />}
          </Card>
          <Card title="My task pipeline">
            <StatusCompositionBar segments={taskCompositionSegments(myTasks)} />
          </Card>
        </div>

        <div style={{ marginTop: 16 }}>
          <Card title="My controls">
            <Rows empty="No controls match the current filters.">
              {myControls.map((c) => (
                <tr key={c.code} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 4px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{c.code}</td>
                  <td style={{ padding: "8px 4px" }}>{c.title}</td>
                  <td style={{ padding: "8px 4px", textAlign: "right" }}><StatusBadge status={c.status as ControlStatus} /></td>
                </tr>
              ))}
            </Rows>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <Card title="My risks">
            <Rows empty="No risks match the current filters.">
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
          <Card title="My tasks">
            <Rows empty="No tasks match the current filters.">
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

  // ---------------- Auditor ----------------
  if (user.role === "Auditor") {
    const scopedAudits = scopeAudits(audits);
    const scopedEvidence = scopeEvidence(evidence, "all").filter((e) => e.state !== "Valid");
    const totalFindings = scopedAudits.reduce((s, a) => s + a.findings, 0);
    const completed = scopedAudits.filter((a) => a.status === "Completed").length;
    const findingsByFramework: CategoryBarDatum[] = frameworks
      .filter((f) => filters.framework === "all" || f.slug === filters.framework)
      .map((f) => ({
        name: f.code,
        value: audits.filter((a) => a.framework === f.slug).reduce((s, a) => s + a.findings, 0),
        detail: f.name,
      }))
      .filter((d) => d.value > 0);

    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {header}
        <DashboardFilters value={filters} onChange={setFilters} frameworks={frameworkOptions} showOwner={false} showTaskStatus={false} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "0 0 16px" }}>
          <Kpi label="Upcoming audits" value={String(scopedAudits.filter((a) => a.status === "Upcoming").length)} accent="var(--blue)" />
          <Kpi label="Completed audits" value={String(completed)} accent="var(--accent)" />
          <Kpi label="Total findings" value={String(totalFindings)} accent="var(--amber)" />
          <Kpi label="Evidence needing attention" value={String(scopedEvidence.length)} accent="var(--red)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="Findings by framework">
            {findingsByFramework.length ? <CategoryBarChart data={findingsByFramework} height={200} /> : <Empty text="No findings in this scope." />}
          </Card>
          <Card title="Evidence health">
            <StatusCompositionBar segments={evidenceCompositionSegments(scopeEvidence(evidence, "all"))} />
          </Card>
        </div>

        <div style={{ marginTop: 16 }}>
          <Card title="Audit trail">
            <Rows empty="No audits match the current filters.">
              {scopedAudits.map((a) => (
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
        </div>

        <div style={{ marginTop: 16 }}>
          <Card title="Evidence needing attention">
            <Rows empty="Everything is valid — nothing expiring or expired.">
              {scopedEvidence.map((e) => (
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

  // ---------------- Executive ----------------
  if (user.role === "Executive") {
    const totalControls = frameworks.reduce((s, f) => s + f.controls, 0);
    const compliant = frameworks.reduce((s, f) => s + f.compliant, 0);
    const readiness = Math.round((compliant / totalControls) * 100);
    const openTasks = tasks.filter((t) => t.status !== "Done").length;
    const upcoming = audits.filter((a) => a.status === "Upcoming").length;
    const scopedRisks = scopeRisks(risks, "all");

    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {header}
        <DashboardFilters value={filters} onChange={setFilters} frameworks={frameworkOptions} showOwner={false} showTaskStatus={false} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "0 0 16px" }}>
          <Kpi label="Overall readiness" value={`${readiness}%`} accent="var(--green)" />
          <Kpi label="Controls tracked" value={String(totalControls)} accent="var(--accent)" />
          <Kpi label="Open tasks" value={String(openTasks)} accent="var(--amber)" />
          <Kpi label="Upcoming audits" value={String(upcoming)} accent="var(--blue)" />
        </div>

        <Card title="Framework readiness">
          <FrameworkCompositionChart data={frameworkChartData} />
        </Card>

        <div style={{ marginTop: 16 }}>
          <Card title="Risk exposure by category">
            {scopedRisks.length ? <CategoryBarChart data={riskCategoryData(scopedRisks)} /> : <Empty text="No risks match the current filters." />}
          </Card>
        </div>
      </div>
    );
  }

  // ---------------- Admin & Compliance Officer — full enterprise view ----------------
  const totalControls = frameworks.reduce((s, f) => s + f.controls, 0);
  const compliant = frameworks.reduce((s, f) => s + f.compliant, 0);
  const readiness = Math.round((compliant / totalControls) * 100);
  const scopedTasksForKpi = scopeTasks(tasks);
  const upcoming = audits.filter((a) => a.status === "Upcoming").length;
  const scopedRisks = scopeRisks(risks);
  const scopedTasks = scopeTasks(tasks);
  const scopedEvidence = scopeEvidence(evidence);
  const topRisks = [...scopedRisks].sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact).slice(0, 5);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {header}
      <DashboardFilters value={filters} onChange={setFilters} frameworks={frameworkOptions} owners={owners} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "0 0 16px" }}>
        <Kpi label="Overall readiness" value={`${readiness}%`} accent="var(--green)" />
        <Kpi label="Controls tracked" value={String(totalControls)} accent="var(--accent)" />
        <Kpi label="Open tasks (scoped)" value={String(scopedTasksForKpi.filter((t) => t.status !== "Done").length)} accent="var(--amber)" />
        <Kpi label="Upcoming audits" value={String(upcoming)} accent="var(--blue)" />
      </div>

      <Card title="Framework readiness">
        <FrameworkCompositionChart data={frameworkChartData} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, marginTop: 16 }}>
        <Card title="Risk exposure (likelihood × impact)">
          {scopedRisks.length ? <RiskHeatmap risks={scopedRisks} /> : <Empty text="No risks match the current filters." />}
        </Card>
        <Card title="Risk exposure by category">
          {scopedRisks.length ? <CategoryBarChart data={riskCategoryData(scopedRisks)} height={220} /> : <Empty text="No risks match the current filters." />}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card title="Task pipeline">
          <StatusCompositionBar segments={taskCompositionSegments(scopedTasks)} />
        </Card>
        <Card title="Evidence health">
          <StatusCompositionBar segments={evidenceCompositionSegments(scopedEvidence)} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card title="Top risks">
          <Rows empty="No risks match the current filters.">
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
          <Rows empty="No tasks match the current filters.">
            {scopedTasks.filter((t) => t.status !== "Done").slice(0, 6).map((t) => (
              <tr key={t.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 4px" }}>{t.title}</td>
                <td style={{ padding: "8px 4px", color: "var(--text-secondary)" }}>{t.assignee}</td>
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

function Empty({ text }: { text: string }) {
  return <div style={{ color: "var(--text-tertiary)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>{text}</div>;
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
    <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginTop: 0 }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}
