type PlaceholderProps = {
  title: string;
};

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="cw-placeholder">
      <h1>{title}</h1>
      <p>Content is coming soon.</p>
    </div>
  );
}
