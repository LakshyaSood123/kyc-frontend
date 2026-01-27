export default function LogsWidget() {
  const rows = [
    { ts: "2026-01-25T20:31:15.000Z", account: "127.0.0.1", status: 200, server: "localhost" },
    { ts: "2026-01-25T20:31:49.000Z", account: "100.127.10.129", status: 200, server: "cloudfront" },
    { ts: "2026-01-25T20:32:03.000Z", account: "100.127.10.129", status: 403, server: "api-gw" },
  ];

  return (
    <div className="cw-logtable">
      <div className="cw-loghead">
        <span>#</span><span>timestamp</span><span>REMOTE_ADDR</span><span>status</span><span>server</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="cw-logrow">
          <span>{i + 1}</span>
          <span>{r.ts}</span>
          <span>{r.account}</span>
          <span>{r.status}</span>
          <span>{r.server}</span>
        </div>
      ))}
    </div>
  );
}
