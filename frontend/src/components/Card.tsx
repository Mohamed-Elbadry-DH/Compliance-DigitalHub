export function Card({ title, children, style }: { title?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, ...style }}>
      {title && <div style={{ fontWeight: 600, marginBottom: 12 }}>{title}</div>}
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ fontSize: 22, margin: 0 }}>{title}</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{subtitle}</p>
    </div>
  );
}
