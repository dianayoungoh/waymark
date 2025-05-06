import DashboardToolbar from "./DashboardToolbar";
import StatePanel from "./StatePanel";
import "../styles/dashboard.css";
import { useCovid } from "../context/CovidContext";

function CovidDashboard() {
  const { covidByState, selectedStates} = useCovid();

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">COVID-19 Dashboard</h1>
      <DashboardToolbar />
      <div className="state-list">
        {selectedStates.map((state, index) =>
          covidByState[state] ? (
            <StatePanel
              key={state}
              stateInfo={{ name: state, index, data: covidByState[state] }}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default CovidDashboard;
