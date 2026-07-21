import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { STATUS } from "@/lib/palette";

export interface FrameworkDatum {
  code: string;
  name: string;
  compliant: number;
  inProgress: number;
  gap: number;
  pct: number;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--text)", color: "#fff", fontSize: 12, padding: "8px 10px", borderRadius: 6 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey}><strong>{p.value}</strong> · {p.name}</div>
      ))}
    </div>
  );
}

/** Part-to-whole across frameworks — stacked bar, status color (never a pie past ~2 slices). */
export function FrameworkCompositionChart({ data, height = 260 }: { data: FrameworkDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }} barCategoryGap={12}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="0" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="code" width={140} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-hover)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="compliant" name="Compliant" stackId="s" fill={STATUS.good} radius={[4, 0, 0, 4]} maxBarSize={20} />
        <Bar dataKey="inProgress" name="In progress" stackId="s" fill={STATUS.warning} maxBarSize={20} />
        <Bar dataKey="gap" name="Gap" stackId="s" fill={STATUS.critical} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
