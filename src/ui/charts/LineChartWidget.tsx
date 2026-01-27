import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function LineChartWidget({ data }: { data: any[] }) {
  return (
    <div className="cw-chart">
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={data}>
          <XAxis dataKey="t" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cwu" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="storekeeper" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="sys" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
