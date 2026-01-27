export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="cw-page">
      <h2 className="cw-h2">{title}</h2>
      <p className="cw-muted">This page is wired in the nav, UI will be added next.</p>
    </div>
  );
}
