export default function AlarmStatusWidget() {
  const alarms = [
    { name: "MyCompositeAlarm", status: "ALARM" },
    { name: "CPU Alarm", status: "ALARM" },
    { name: "simpleMetricAlarm", status: "OK" },
  ];

  return (
    <div className="cw-list">
      {alarms.map((a) => (
        <div
          key={a.name}
          className={
            a.status === "ALARM" ? "cw-alarm cw-alarm-alarm" : "cw-alarm cw-alarm-ok"
          }
        >
          <div className="cw-alarm-icon">{a.status === "ALARM" ? "⚠" : "✓"}</div>
          <div className="cw-alarm-name">{a.name}</div>
        </div>
      ))}
    </div>
  );
}
