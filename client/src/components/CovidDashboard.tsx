// CovidDashboard.tsx
import { useState, useEffect } from "react";
import DashboardToolbar from "./DashboardToolbar";
import StatePanel from "./StatePanel";
import { CovidData, DisplayMode, ChartType } from "../types/types";
import "../styles/dashboard.css";
import { STATES, MAX_STATES } from "../constants/constants";

function CovidDashboard() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [covidByState, setCovidByState] = useState<Record<string, CovidData[]>>(
    {},
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cases");
  const [chartType, setChartType] = useState<ChartType>("bar");

  // Fetch all states data at once and store them in the state since API is static
  useEffect(() => {
    const fetchAllStates = async () => {
      const stateDataPairs = await Promise.all(
        STATES.map(async (state) => {
          const res = await fetch(
            `https://api.covidtracking.com/v2/states/${state.toLowerCase()}/daily/simple.json`,
          );
          const json = await res.json();
          //Sort data chronologically (oldest to newest) since the API returns it in reverse
          const sortedData = [...json.data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
          return [state, sortedData] as const;
        }),
      );
      setCovidByState(Object.fromEntries(stateDataPairs));
    };

    fetchAllStates();
  }, []);

  const addState = (state: string) => {
    setSelectedStates((prev) => {
      if (!prev.includes(state) && prev.length < MAX_STATES) {
        return [...prev, state];
      }
      return prev;
    });
  };

  const removeState = (state: string) => {
    setSelectedStates((prev) => prev.filter((st) => st !== state));
  };
  /**
   * Reorders the selectedStates array by swapping the state at the given index
   * with its neighbor in the specified direction (e.g., up = -1, down = +1).
   * Prevents out-of-bounds moves.
   */

  const moveState = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedStates.length) return;

    setSelectedStates((prev) => {
      const updatedStates = [...prev];
      [updatedStates[index], updatedStates[newIndex]] = [
        updatedStates[newIndex],
        updatedStates[index],
      ];
      return updatedStates;
    });
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">COVID-19 Dashboard</h1>
      <DashboardToolbar
        stateControl={{ selectedStates, addState }}
        displayControl={{ displayMode, setDisplayMode }}
        chartControl={{ chartType, setChartType }}
      />
      <div className="state-list">
        {selectedStates.map((state, index) =>
          covidByState[state] ? (
            <StatePanel
              key={state}
              stateInfo={{ name: state, index, data: covidByState[state] }}
              displayMode={displayMode}
              chartType={chartType}
              moveState={moveState}
              removeState={removeState}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

export default CovidDashboard;
