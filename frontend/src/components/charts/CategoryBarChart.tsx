import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { categoricalColor } from "@/lib/palette";

export interface CategoryBarDatum {
  name: string;
  value: number;
  detail?: string;
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as CategoryBarDatum;
  return (
    <div style={{ background: "var(--text)", color: "#fff", fontSize: 12, padding: "8px 10px", borderRadius: 6 }}>
      <div><strong>{p.value}</strong> · {p.name}</div>
      {p.detail && <div style={{ opacity: 0.8, marginTop: 2 }}>{p.detail}</div>}
    </div>
  );
}

/** Magnitude comparison, identity carried by fixed categorical order — one bar per entity. */
export function CategoryBarChart({ data, height = 220, valueLabel }: { data: CategoryBarDatum[]; height?: number; valueLabel?: (v: number) => string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 4 }} barCategoryGap={10}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-hover)" }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((_, i) => <Cell key={i} fill={categoricalColor(i)} />)}
          <LabelList
            dataKey="value"
            position="right"
            style={{ fontSize: 12, fontWeight: 600, fill: "var(--text)" }}
            formatter={(v: unknown) => (valueLabel ? valueLabel(Number(v)) : String(v))}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
