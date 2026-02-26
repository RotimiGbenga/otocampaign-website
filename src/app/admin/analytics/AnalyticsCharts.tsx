"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

type LgaData = { lga: string; count: number };
type ChartData = { name: string; value: number };

const CHART_COLORS = [
  "#16a34a",
  "#15803d",
  "#166534",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
];

type GrowthData = { date: string; count: number; displayDate: string };

type Props = {
  lgaData: LgaData[];
  skillsData: ChartData[];
  availabilityData: ChartData[];
  growthData: GrowthData[];
};

export function AnalyticsCharts({
  lgaData,
  skillsData,
  availabilityData,
  growthData,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Growth Trend - Time Series */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Growth Trend (Last 30 Days)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          New volunteers registered per day
        </p>
        <div className="h-72">
          {growthData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={growthData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    value ?? 0,
                    "Volunteers",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  labelFormatter={(label, payload) => {
                    const first = Array.isArray(payload)
                      ? payload[0]
                      : payload;
                    const date =
                      first && typeof first === "object" && "payload" in first
                        ? (first.payload as { date?: string }).date
                        : undefined;
                    return date
                      ? new Date(date).toLocaleDateString("en-NG", {
                          dateStyle: "medium",
                        })
                      : String(label);
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Volunteers"
                  dot={{ fill: "#16a34a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Volunteers per LGA - Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Volunteers per LGA
        </h2>
        <div className="h-80">
          {lgaData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lgaData}
                margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="lga"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    value ?? 0,
                    "Volunteers",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar dataKey="count" fill="#16a34a" name="Volunteers" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Skills distribution - Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Skills Distribution
        </h2>
        <div className="h-80">
          {skillsData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No skills data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {skillsData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => [
                    value ?? 0,
                    "Volunteers",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Availability breakdown - Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Availability Breakdown
        </h2>
        <div className="h-80">
          {availabilityData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No availability data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={availabilityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {availabilityData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => [
                    value ?? 0,
                    "Volunteers",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
