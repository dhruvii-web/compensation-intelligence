"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

type Compensation = {
  level: string;
  totalCompensation: number;
  baseSalary: number;
  bonus: number;
  stock: number;
};

export default function CompanyCharts({
  compensations,
}: {
  compensations: Compensation[];
}) {
  const levelMap = new Map<
    string,
    number[]
  >();

  compensations.forEach(
    (item) => {
      if (
        !levelMap.has(item.level)
      ) {
        levelMap.set(
          item.level,
          []
        );
      }

      levelMap
        .get(item.level)
        ?.push(
          item.totalCompensation
        );
    }
  );

  const barData =
    Array.from(
      levelMap.entries()
    ).map(([level, vals]) => ({
      level,
      compensation:
        vals.reduce(
          (a, b) => a + b,
          0
        ) / vals.length,
    }));

  const avgBase =
    compensations.reduce(
      (sum, item) =>
        sum + item.baseSalary,
      0
    ) /
    Math.max(
      compensations.length,
      1
    );

  const avgBonus =
    compensations.reduce(
      (sum, item) =>
        sum + item.bonus,
      0
    ) /
    Math.max(
      compensations.length,
      1
    );

  const avgStock =
    compensations.reduce(
      (sum, item) =>
        sum + item.stock,
      0
    ) /
    Math.max(
      compensations.length,
      1
    );

  const pieData = [
    {
      name: "Base",
      value: avgBase,
    },
    {
      name: "Bonus",
      value: avgBonus,
    },
    {
      name: "Stock",
      value: avgStock,
    },
  ];

  const COLORS = [
    "#0f172a",
    "#64748b",
    "#cbd5e1",
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
      {/* BAR CHART */}
      <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-5">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Compensation by Level
          </h2>

          <p className="text-slate-500 text-sm">
            Average TC by level
          </p>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="level"
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `₹${(
                    v / 100000
                  ).toFixed(0)}L`
                }
              />

              <Tooltip
                contentStyle={{
                  borderRadius:
                    "12px",
                  border:
                    "1px solid #e2e8f0",
                  background:
                    "#fff",
                }}
                formatter={(
                  value: number
                ) => [
                  `₹${Math.round(
                    value
                  ).toLocaleString()}`,
                  "TC",
                ]}
              />

              <Bar
                dataKey="compensation"
                fill="#0f172a"
                radius={[
                  10, 10, 0, 0,
                ]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-5">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Compensation Breakdown
          </h2>

          <p className="text-slate-500 text-sm">
            Base vs Bonus vs Stock
          </p>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                stroke="none"
                label={({
                  name,
                  percent,
                }) =>
                  `${(
                    percent * 100
                  ).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                formatter={(
                  value: number,
                  name
                ) => [
                  `₹${Math.round(
                    value
                  ).toLocaleString()}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 text-sm text-slate-600 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-900" />
            Base
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            Bonus
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            Stock
          </div>
        </div>
      </div>
    </div>
  );
}