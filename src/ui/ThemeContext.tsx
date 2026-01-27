import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ThemeMode = "dark" | "light";
type TimeRange = "1h" | "3h" | "12h" | "1d" | "3d" | "1w" | "custom";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  range: TimeRange;
  setRange: (r: TimeRange) => void;
};

const Ctx = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [range, setRange] = useState<TimeRange>("3h");

  const value = useMemo(() => ({ theme, setTheme, range, setRange }), [theme, range]);
  return (
    <Ctx.Provider value={value}>
      <div data-theme={theme}>{children}</div>
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
