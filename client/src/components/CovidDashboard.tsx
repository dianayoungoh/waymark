/**
 * CovidDashboard.tsx
 *
 * Top-level container for the COVID-19 dashboard UI.
 * Renders the state selection toolbar and a list of StatePanels
 * for each selected state. Data is consumed from CovidContext.
 */

import DashboardToolbar from "./DashboardToolbar";
import StatePanel from "./StatePanel";
import "../styles/dashboard.css";
import { useCovid } from "../context/CovidContext";

const CovidDashboard = () => {
  const { covidByState, selectedStates } = useCovid();

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">COVID-19 Dashboard</h1>
      <DashboardToolbar />
      <div className="state-list">
        {/* Render a panel for each selected state */}
        {selectedStates.map((state, index) =>
          covidByState[state] ? (
            <StatePanel
              key={state}
              stateInfo={{ name: state, index, data: covidByState[state] }}
            />
          ) : null,
        )}
      </div>
    </div>
  );
};

export default CovidDashboard;
