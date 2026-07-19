import { useState } from "react";
import { demo, DEMO } from "@/api/demo";
import { useAuth } from "@/stores/authStore";
import { apiLogin } from "@/api/auth";
import { ROLE_LABEL, type Role } from "@/auth/permissions";

const DEMO_PASSWORD = "Demo123!"; // seeded for every Digital Hub user

const ROLE_COLOR: Record<string, { bg: string; fg: string }> = {
  Admin: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  ComplianceOfficer: { bg: "var(--blue-soft)", fg: "var(--blue)" },
  DepartmentLead: { bg: "var(--green-soft)", fg: "var(--green)" },
  Auditor: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  Executive: { bg: "var(--gray-soft)", fg: "var(--gray)" },
};

export function LoginPage() {
  const login = useAuth((s) => s.login);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function pick(u: { name: string; email: string; role: string; title: string }) {
    setErr(null);
    if (DEMO) {
      login({ ...u, role: u.role as Role });   // offline demo: local session
      return;
    }
    // Real mode: authenticate against the .NET API
    setBusy(u.email);
    try {
      const res = await apiLogin(u.email, DEMO_PASSWORD);
      login({ name: res.name, email: res.email, role: res.role, title: res.title ?? "" });
    } catch {
      setErr("Could not reach the API. Is the backend running on :5080?");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-sunken)" }}>
      <div style={{ width: 520, maxWidth: "92vw" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>Conformix</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
            {demo.company.name} · sign in to continue
          </div>
        </div>

        <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
            {DEMO ? "Demo · choose a user to preview their role and permissions"
                  : "Choose a user to sign in via the API"}
          </div>
          {err && <div style={{ background: "var(--red-soft)", color: "var(--red)", padding: "8px 10px", borderRadius: 8, fontSize: 12, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {demo.users.map((u) => {
              const c = ROLE_COLOR[u.role] ?? ROLE_COLOR.Executive;
              return (
                <button key={u.email} onClick={() => pick(u)} disabled={busy === u.email}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px",
                    background: "var(--bg-elev)", textAlign: "left", opacity: busy === u.email ? 0.6 : 1,
                  }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 34, height: 34, borderRadius: 999, background: c.bg, color: c.fg,
                      display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13,
                    }}>{u.name.split(" ").map((n) => n[0]).join("")}</span>
                    <span>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{u.title}</div>
                    </span>
                  </span>
                  <span style={{ background: c.bg, color: c.fg, padding: "3px 10px", borderRadius: 999, fontWeight: 600, fontSize: 12 }}>
                    {ROLE_LABEL[u.role as Role]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
