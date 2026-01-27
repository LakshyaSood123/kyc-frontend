import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export default function BarChartWidget({ data }: { data: any[] }) {
  return (
    <div className="cw-chart">
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="a" />
          <Bar dataKey="b" />
          <Bar dataKey="c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
