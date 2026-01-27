export default function AdminDashboard() {
  return (
    <div className="cw-page">
      <div className="cw-card cw-card-tone-neutral">
        <h1 className="cw-title">Admin Console</h1>
        <p className="cw-muted">
          Admin routes must be accessed through a secure BFF that injects
          <code> x-admin-token</code>. This UI should never hold admin tokens.
        </p>
      </div>
    </div>
  );
}
