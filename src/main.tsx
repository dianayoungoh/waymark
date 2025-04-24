import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import CovidDashboard from "./components/CovidDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CovidDashboard />
  </StrictMode>,
);
