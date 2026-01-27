export default function ContributorInsightsWidget() {
  const rows = [
    { name: "aws:s3:GetObject", v: 22 },
    { name: "aws:s3:ListObjects", v: 18 },
    { name: "aws:lambda:Invoke", v: 12 },
    { name: "dynamodb:Query", v: 9 },
  ];

  return (
    <div>
      <div className="cw-muted" style={{ marginBottom: 8 }}>
        36 unique contributors
      </div>

      <div className="cw-mini-table">
        {rows.map((r) => (
          <div key={r.name} className="cw-mini-row">
            <span className="cw-mini-left">{r.name}</span>
            <span className="cw-mini-right">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
