import { useTheme } from "./ThemeContext";

const ranges = ["1h", "3h", "12h", "1d", "3d", "1w", "custom"] as const;

export default function TopBar({
  mode,
  onLogout,
}: {
  mode: "portal" | "admin";
  onLogout?: () => void;
}) {
  const { theme, setTheme, range, setRange } = useTheme();

  return (
    <header className="cw-topbar">
      <div className="cw-topbar-left">
        <div className="cw-title">
          {mode === "portal" ? "Client Portal" : "Admin Console"} —{" "}
          <span className="cw-title-weak">My-Shared-Dashboard</span>
        </div>
      </div>

      <div className="cw-topbar-right">
        <div className="cw-toggle">
          <button
            className={theme === "light" ? "cw-btn cw-btn-active" : "cw-btn"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            className={theme === "dark" ? "cw-btn cw-btn-active" : "cw-btn"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>

        <div className="cw-range">
          {ranges.map((r) => (
            <button
              key={r}
              className={range === r ? "cw-btn cw-btn-active" : "cw-btn"}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="cw-actions">
          {onLogout && (
            <button className="cw-btn" onClick={onLogout} title="Sign out">
              Sign out
            </button>
          )}
          <button className="cw-btn">Options ▾</button>
          <button className="cw-btn" title="Refresh">
            ⟳
          </button>
          <button className="cw-btn" title="More">
            ⋯
          </button>
        </div>
      </div>
    </header>
  );
}
