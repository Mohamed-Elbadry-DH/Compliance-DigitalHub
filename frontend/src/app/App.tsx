import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ControlsPage } from "@/features/controls/ControlsPage";
import { RisksPage } from "@/features/risks/RisksPage";
import { EvidencePage } from "@/features/evidence/EvidencePage";
import { TasksPage } from "@/features/tasks/TasksPage";
import { AuditsPage } from "@/features/audits/AuditsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { useAuth } from "@/stores/authStore";
import { ROLE_LABEL, isReadOnly, type Role } from "@/auth/permissions";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/controls", label: "Controls" },
  { to: "/risks", label: "Risk Register" },
  { to: "/evidence", label: "Evidence" },
  { to: "/tasks", label: "Tasks" },
  { to: "/audits", label: "Audits" },
  { to: "/settings", label: "Settings" },
];

export function App() {
  const user = useAuth((s) => s.user);
  if (!user) return <LoginPage />;   // gate the whole app behind sign-in

  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1 }}>
          {isReadOnly(user.role) && (
            <div style={{ background: "var(--amber-soft)", color: "var(--amber)", fontSize: 12, padding: "6px 24px", borderBottom: "1px solid var(--border)" }}>
              Read-only access — your role ({ROLE_LABEL[user.role]}) can view but not edit.
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/controls" element={<ControlsPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/audits" element={<AuditsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Sidebar() {
  const user = useAuth((s) => s.user)!;
  const logout = useAuth((s) => s.logout);
  return (
    <aside style={{ width: 220, background: "var(--bg-elev)", borderRight: "1px solid var(--border)", padding: 16, display: "flex", flexDirection: "column" }}>
      <div style={{ fontWeight: 700, fontSize: 16 }}>Conformix</div>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 16 }}>ISO Compliance Portal</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            padding: "8px 10px", borderRadius: 8, textDecoration: "none",
            background: isActive ? "var(--accent-soft)" : "transparent",
            color: isActive ? "var(--accent)" : "var(--text)", fontWeight: 500,
          })}>{n.label}</NavLink>
        ))}
      </nav>
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>{ROLE_LABEL[user.role as Role]}</div>
        <button onClick={logout} style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--bg-elev)", fontSize: 12 }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
