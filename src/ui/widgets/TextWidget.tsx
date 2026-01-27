export default function TextWidget() {
  return (
    <div>
      <div className="cw-muted" style={{ marginBottom: 10 }}>
        Widget demo
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="cw-btn">Button link</button>
        <button className="cw-btn cw-btn-active">Primary button link</button>
      </div>
    </div>
  );
}
