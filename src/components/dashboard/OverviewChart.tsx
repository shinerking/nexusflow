"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  category: string;
  stock: number;
};

export default function OverviewChart({ chartData }: { chartData: ChartData[] }) {
  // If no data, show placeholder
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-muted-foreground">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              color: "hsl(var(--popover-foreground))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            formatter={(value: number | undefined) => [`${value || 0} units`, "Stock"]}
          />
          <Bar
            dataKey="stock"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Stock"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
