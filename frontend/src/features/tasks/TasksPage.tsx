import { demo } from "@/api/demo";
import { PageHeader } from "@/components/Card";

const COLS = [
  { key: "Todo", label: "To do" },
  { key: "InProgress", label: "In progress" },
  { key: "Blocked", label: "Blocked" },
  { key: "Done", label: "Done" },
];
const PRIO: Record<string, string> = { High: "var(--red)", Medium: "var(--amber)", Low: "var(--gray)" };

export function TasksPage() {
  const tasks = demo.tasks;
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="Tasks" subtitle={`${tasks.length} remediation tasks across the program`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {COLS.map((c) => {
          const list = tasks.filter((t) => t.status === c.key);
          return (
            <div key={c.key} style={{ background: "var(--bg-sunken)", borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>{c.label}</span><span>{list.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((t) => (
                  <div key={t.id} style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>{t.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)" }}>
                      <span>{t.assignee}</span>
                      <span style={{ color: PRIO[t.priority], fontWeight: 600 }}>{t.priority}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>Due {t.due} · {t.control}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
