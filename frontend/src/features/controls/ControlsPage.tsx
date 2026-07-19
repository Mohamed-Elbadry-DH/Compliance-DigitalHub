import { useState } from "react";
import { useControls } from "@/hooks/useControls";
import { StatusBadge } from "@/components/StatusBadge";
import type { ControlStatus } from "@/api/controls";
import { useAuth } from "@/stores/authStore";
import { can } from "@/auth/permissions";

const STATUSES: (ControlStatus | "All")[] = ["All", "Compliant", "InProgress", "Gap"];

/** Reference vertical slice: real API data + RBAC-gated edit action. */
export function ControlsPage() {
  const [status, setStatus] = useState<ControlStatus | "All">("All");
  const { data, isLoading, isError, error } = useControls(status === "All" ? {} : { status });
  const role = useAuth((s) => s.user!.role);
  const mayEdit = can(role, "controls.edit");

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Controls</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Every control across your frameworks.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border-strong)",
              background: status === s ? "var(--accent)" : "var(--bg-elev)",
              color: status === s ? "#fff" : "var(--text)",
            }}>{s}</button>
        ))}
      </div>

      {isLoading && <p>Loading controls…</p>}
      {isError && <p style={{ color: "var(--red)" }}>Failed to load: {(error as Error).message}</p>}

      {data && (
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--bg-elev)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-sunken)", textAlign: "left" }}>
                <th style={th}>Code</th><th style={th}>Title</th>
                <th style={th}>Owner</th><th style={th}>Status</th><th style={th}>Evidence</th><th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{c.code}</td>
                  <td style={td}>{c.title}</td>
                  <td style={td}>{c.owner ?? "—"}</td>
                  <td style={td}><StatusBadge status={c.status} /></td>
                  <td style={td}>{c.evidenceCount}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <button disabled={!mayEdit}
                      title={mayEdit ? "Edit control" : "Your role can't edit controls"}
                      style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 12,
                        border: "1px solid var(--border-strong)",
                        background: mayEdit ? "var(--bg-elev)" : "var(--bg-sunken)",
                        color: mayEdit ? "var(--text)" : "var(--text-tertiary)",
                        cursor: mayEdit ? "pointer" : "not-allowed",
                      }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 };
const td: React.CSSProperties = { padding: "10px 14px", borderTop: "1px solid var(--border)" };
