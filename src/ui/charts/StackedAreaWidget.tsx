import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export default function StackedAreaWidget({ data }: { data: any[] }) {
  return (
    <div className="cw-chart">
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data}>
          <XAxis dataKey="t" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="cwu" stackId="1" strokeWidth={1} />
          <Area type="monotone" dataKey="storekeeper" stackId="1" strokeWidth={1} />
          <Area type="monotone" dataKey="sys" stackId="1" strokeWidth={1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
