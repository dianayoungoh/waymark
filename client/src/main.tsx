import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import CovidDashboard from "./components/CovidDashboard.tsx";
import { CovidProvider } from "./context/CovidContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <CovidProvider>
      <CovidDashboard />
    </CovidProvider>
  </StrictMode>,
);
