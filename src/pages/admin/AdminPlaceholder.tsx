export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="cw-page">
      <div className="cw-card cw-card-tone-neutral">
        <h1 className="cw-title">{title}</h1>
        <p className="cw-muted">Admin actions require a server-side BFF.</p>
      </div>
    </div>
  );
}
