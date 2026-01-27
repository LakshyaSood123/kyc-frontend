import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export default function AlarmAnomalyWidget({ data }: { data: any[] }) {
  return (
    <div>
      <div className="cw-alertline">
        <span className="cw-badge">Alarm</span>
        <span className="cw-alerttext">CPUUtilization is not within the band for 1 datapoints…</span>
      </div>

      <div className="cw-chart">
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={data}>
            <XAxis dataKey="t" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpu" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="expected" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
