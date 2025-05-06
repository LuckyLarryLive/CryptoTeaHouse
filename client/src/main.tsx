import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { WalletContextProvider } from "./contexts/WalletContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </QueryClientProvider>
);
