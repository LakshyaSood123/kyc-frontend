export default function NumberWidgetRow() {
  const nums = [
    { label: "CwuSampleapp-env", value: "0.53%" },
    { label: "Scorekeeper-env", value: "0.57%" },
    { label: "Systems Manager Test", value: "0.1%" },
  ];

  return (
    <div className="cw-numbers">
      {nums.map((n) => (
        <div key={n.label} className="cw-number">
          <div className="cw-number-val">{n.value}</div>
          <div className="cw-number-label">{n.label}</div>
        </div>
      ))}
    </div>
  );
}
