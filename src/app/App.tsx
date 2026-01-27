import { AppRouter } from "./router";
import { ThemeProvider } from "../ui/ThemeContext";
import { PortalAuthProvider } from "../lib/portalAuth";

export default function App() {
  return (
    <ThemeProvider>
      <PortalAuthProvider>
        <AppRouter />
      </PortalAuthProvider>
    </ThemeProvider>
  );
}
