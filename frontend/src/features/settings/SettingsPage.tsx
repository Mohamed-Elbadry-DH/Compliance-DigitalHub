import { useState } from "react";
import { demo } from "@/api/demo";
import { Card, PageHeader } from "@/components/Card";
import { useAuth } from "@/stores/authStore";
import {
  ALL_PERMISSIONS, PERMISSION_LABEL, ROLE_LABEL, can, isReadOnly, type Role,
} from "@/auth/permissions";

const ROLES: Role[] = ["Admin", "ComplianceOfficer", "DepartmentLead", "Auditor", "Executive"];
const TABS = ["Users & roles", "Permissions", "Workspace"] as const;

export function SettingsPage() {
  const me = useAuth((s) => s.user)!;
  const [tab, setTab] = useState<(typeof TABS)[number]>("Users & roles");
  const canManage = can(me.role, "users.manage");

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="Settings" subtitle="Users, roles, and workspace configuration" />

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border-strong)",
            background: tab === t ? "var(--accent)" : "var(--bg-elev)",
            color: tab === t ? "#fff" : "var(--text)",
          }}>{t}</button>
        ))}
      </div>

      {tab === "Users & roles" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{demo.users.length} users</div>
            <button
              disabled={!canManage}
              title={canManage ? "" : "Your role can't manage users"}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "none", fontWeight: 600,
                background: canManage ? "var(--accent)" : "var(--bg-sunken)",
                color: canManage ? "#fff" : "var(--text-tertiary)",
                cursor: canManage ? "pointer" : "not-allowed",
              }}>+ Invite user</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ textAlign: "left", color: "var(--text-secondary)" }}>
              <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Title</th><th style={th}>Role</th>
            </tr></thead>
            <tbody>
              {demo.users.map((u) => (
                <tr key={u.email} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={td}>{u.name}{u.email === me.email && <span style={{ color: "var(--text-tertiary)" }}> · you</span>}</td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>{u.email}</td>
                  <td style={td}>{u.title}</td>
                  <td style={td}><RoleBadge role={u.role as Role} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "Permissions" && (
        <Card title="Role permissions matrix">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              <th style={{ ...th, textAlign: "left" }}>Permission</th>
              {ROLES.map((r) => <th key={r} style={{ ...th, textAlign: "center" }}>{ROLE_LABEL[r]}</th>)}
            </tr></thead>
            <tbody>
              {ALL_PERMISSIONS.map((p) => (
                <tr key={p} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={td}>{PERMISSION_LABEL[p]}</td>
                  {ROLES.map((r) => (
                    <td key={r} style={{ ...td, textAlign: "center" }}>
                      {can(r, p)
                        ? <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>
                        : <span style={{ color: "var(--text-quaternary,#b5b4ae)" }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "Workspace" && (
        <Card title="Workspace">
          <Row k="Organization" v={demo.company.name} />
          <Row k="Industry" v={demo.company.industry} />
          <Row k="Headquarters" v={demo.company.hq} />
          <Row k="Employees" v={String(demo.company.employees)} />
          <Row k="Frameworks enabled" v={String(demo.frameworks.length)} />
        </Card>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const ro = isReadOnly(role);
  return (
    <span style={{
      background: ro ? "var(--gray-soft)" : "var(--blue-soft)",
      color: ro ? "var(--gray)" : "var(--blue)",
      padding: "2px 8px", borderRadius: 999, fontWeight: 600, fontSize: 12,
    }}>{ROLE_LABEL[role]}{ro ? " · read-only" : ""}</span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
      <span style={{ color: "var(--text-secondary)" }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
    </div>
  );
}

const th: React.CSSProperties = { padding: "8px 10px", fontSize: 12, fontWeight: 600 };
const td: React.CSSProperties = { padding: "8px 10px" };
