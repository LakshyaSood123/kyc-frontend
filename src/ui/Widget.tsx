import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "violet" | "neutral";

export default function Widget({
  title,
  children,
  right,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  right?: ReactNode;
  tone?: Tone;
}) {
  return (
    <section className={`cw-card cw-card-tone-${tone}`}>
      <div className="cw-card-h">
        <div className="cw-card-title">{title}</div>
        <div className="cw-card-right">{right}</div>
      </div>
      <div className="cw-card-b">{children}</div>
    </section>
  );
}
