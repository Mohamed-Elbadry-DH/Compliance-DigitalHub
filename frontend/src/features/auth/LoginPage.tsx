import { useState } from "react";
import { demo, DEMO } from "@/api/demo";
import { useAuth } from "@/stores/authStore";
import { apiLogin } from "@/api/auth";
import { ROLE_LABEL, type Role } from "@/auth/permissions";

const DEMO_PASSWORD = "Demo123!"; // seeded for every Digital Hub user

export function LoginPage() {
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (DEMO) {
      const match = demo.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match || password !== DEMO_PASSWORD) {
        setErr("Invalid email or password.");
        return;
      }
      login({ ...match, role: match.role as Role });
      return;
    }

    setBusy(true);
    try {
      const res = await apiLogin(email.trim(), password);
      login({ name: res.name, email: res.email, role: res.role, title: res.title ?? "" });
    } catch {
      setErr("Could not reach the API. Is the backend running on :5080?");
    } finally {
      setBusy(false);
    }
  }

  function quickFill(userEmail: string) {
    setErr(null);
    setEmail(userEmail);
    setPassword(DEMO_PASSWORD);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid var(--border)", background: "var(--bg-elev)",
    fontSize: 14, boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-sunken)" }}>
      <div style={{ width: 420, maxWidth: "92vw" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>Conformix</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
            {demo.company.name} · sign in to continue
          </div>
        </div>

        <form onSubmit={signIn}
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          {err && (
            <div style={{ background: "var(--red-soft)", color: "var(--red)", padding: "8px 10px", borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
              {err}
            </div>
          )}

          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="name@digitalhub.example" required autoComplete="username"
            style={{ ...inputStyle, marginBottom: 14 }}
          />

          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password"
            style={{ ...inputStyle, marginBottom: 18 }}
          />

          <button type="submit" disabled={busy}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
              background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 14,
              cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
            }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>

          {DEMO && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6 }}>
                Dev helper (temporary) — pick a demo user to auto-fill their credentials
              </label>
              <select
                defaultValue=""
                onChange={(e) => { if (e.target.value) quickFill(e.target.value); e.target.value = ""; }}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="" disabled>Choose a demo user…</option>
                {demo.users.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name} · {u.title} ({ROLE_LABEL[u.role as Role]})
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
