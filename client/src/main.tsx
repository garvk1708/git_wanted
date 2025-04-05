import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from "./contexts/auth-context";
import { EthereumProvider } from "./contexts/ethereum-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark">
    <AuthProvider>
      <EthereumProvider>
        <App />
      </EthereumProvider>
    </AuthProvider>
  </ThemeProvider>
);
