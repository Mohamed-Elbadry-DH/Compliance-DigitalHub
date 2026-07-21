export interface DashboardFilterState {
  framework: string; // "all" | framework slug — scopes the framework composition chart
  owner: string; // "all" | person name — scopes risk/task/evidence-derived views
  taskStatus: string; // "all" | Todo/InProgress/Blocked/Done — scopes the task pipeline
  search: string; // free text — matches risk/task/evidence/audit titles
}

export const DEFAULT_FILTERS: DashboardFilterState = { framework: "all", owner: "all", taskStatus: "all", search: "" };

export function matchesSearch(search: string, ...fields: (string | undefined)[]): boolean {
  if (!search.trim()) return true;
  const q = search.trim().toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

const controlStyle: React.CSSProperties = {
  padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)",
  background: "var(--bg-elev)", fontSize: 13, cursor: "pointer",
};

/**
 * One filter row above every chart/table it scopes (dataviz interaction rule) — never
 * per-chart. Every consumer re-renders against the same slice so numbers always agree.
 */
export function DashboardFilters({
  value, onChange, frameworks, owners, showOwner = true, showTaskStatus = true,
}: {
  value: DashboardFilterState;
  onChange: (v: DashboardFilterState) => void;
  frameworks: { slug: string; code: string }[];
  owners?: string[];
  showOwner?: boolean;
  showTaskStatus?: boolean;
}) {
  const active = value.framework !== "all" || value.owner !== "all" || value.taskStatus !== "all" || value.search !== "";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 10,
      padding: "10px 12px", marginBottom: 16,
    }}>
      <input
        placeholder="Search risks, tasks, evidence…"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        style={{ ...controlStyle, cursor: "text", minWidth: 200, flex: "1 1 200px" }}
      />

      <select value={value.framework} onChange={(e) => onChange({ ...value, framework: e.target.value })} style={controlStyle}>
        <option value="all">All frameworks</option>
        {frameworks.map((f) => <option key={f.slug} value={f.slug}>{f.code}</option>)}
      </select>

      {showTaskStatus && (
        <select value={value.taskStatus} onChange={(e) => onChange({ ...value, taskStatus: e.target.value })} style={controlStyle}>
          <option value="all">All task statuses</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Done">Done</option>
        </select>
      )}

      {showOwner && owners && (
        <select value={value.owner} onChange={(e) => onChange({ ...value, owner: e.target.value })} style={controlStyle}>
          <option value="all">All owners</option>
          {owners.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {active && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          style={{ ...controlStyle, background: "transparent", border: "none", color: "var(--text-secondary)", textDecoration: "underline" }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
