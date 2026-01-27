import { AppRouter } from "./router";
import { ThemeProvider } from "../ui/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}
