import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
const Analytics: React.FC = () => {
  const goals = JSON.parse(
    localStorage.getItem("focusflow-goals") || "[]"
  );

  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal: any) => goal.completed
  ).length;

  const pendingGoals = totalGoals - completedGoals;

  const completionRate =
    totalGoals === 0
      ? 0
      : Math.round((completedGoals / totalGoals) * 100);
const chartData = [
  {
    name: "Completed",
    value: completedGoals,
  },
  {
    name: "Pending",
    value: pendingGoals,
  },
];

const COLORS = ["#22c55e", "#ef4444"];
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6 md:p-10">

        <h1 className="text-3xl font-bold mb-2">
          Analytics
        </h1>

        <p className="text-slate-500 mb-8">
          Monitor your productivity progress.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Goals
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalGoals}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {completedGoals}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {pendingGoals}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Completion Rate
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {completionRate}%
            </h2>
          </div>

        </div>
<div className="bg-white border rounded-2xl p-6 mt-8">
  <h2 className="text-xl font-semibold mb-6">
    Goal Distribution
  </h2>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
      </div>
    </div>
  );
};

export default Analytics;