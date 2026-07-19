import type { ControlStatus } from "@/api/controls";

const MAP: Record<ControlStatus, { label: string; bg: string; fg: string }> = {
  Compliant:    { label: "Compliant",    bg: "var(--green-soft)", fg: "var(--green)" },
  InProgress:   { label: "In progress",  bg: "var(--amber-soft)", fg: "var(--amber)" },
  Gap:          { label: "Gap",          bg: "var(--red-soft)",   fg: "var(--red)" },
  NotApplicable:{ label: "N/A",          bg: "var(--gray-soft)",  fg: "var(--gray)" },
};

export function StatusBadge({ status }: { status: ControlStatus }) {
  const s = MAP[status];
  return (
    <span style={{
      background: s.bg, color: s.fg, fontWeight: 600, fontSize: 12,
      padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}
