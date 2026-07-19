import { demo } from "@/api/demo";
import { Card, PageHeader } from "@/components/Card";

export function AuditsPage() {
  const audits = [...demo.audits].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="Audits" subtitle="Upcoming certifications and historical internal reviews" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {audits.map((a) => {
          const upcoming = a.status === "Upcoming";
          return (
            <Card key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    {a.type} · {a.auditor} · {a.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    background: upcoming ? "var(--blue-soft)" : "var(--gray-soft)",
                    color: upcoming ? "var(--blue)" : "var(--gray)",
                    padding: "3px 10px", borderRadius: 999, fontWeight: 600, fontSize: 12,
                  }}>{a.status}</span>
                  {!upcoming && (
                    <div style={{ fontSize: 12, color: a.findings ? "var(--red)" : "var(--green)", marginTop: 4 }}>
                      {a.findings} findings
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
