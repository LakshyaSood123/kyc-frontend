import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function PieChartWidget({ data }: { data: any[] }) {
  return (
    <div className="cw-chart">
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={35}
            outerRadius={65}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
