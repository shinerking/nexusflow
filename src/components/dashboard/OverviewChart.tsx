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
      <div className="flex h-80 w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
        <p className="text-slate-500">No inventory data available</p>
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
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#0f172a" }}
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
