// CovidDashboard.tsx
import  { useState, useEffect } from "react";
import DashboardToolbar from "./DashboardToolbar";
import StatePanel from "./StatePanel";
import { CovidData, DisplayMode, ChartType } from "./types";
import "../styles/dashboard.css";

const STATES = ["TN", "WA", "MD", "OH", "FL", "AZ", "WI", "RI", "GA", "KY"];
const MAX_STATES = 5;

const CovidDashboard = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [covidByState, setCovidByState] = useState<Record<string, CovidData[]>>({});
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cases");
  const [chartType, setChartType] = useState<ChartType>("bar");

  useEffect(() => {
    const fetchAllStates = async () => {
      const stateDataPairs = await Promise.all(
        STATES.map(async (state) => {
          const res = await fetch(
            `https://api.covidtracking.com/v2/states/${state.toLowerCase()}/daily/simple.json`
          );
          const json = await res.json();
          const sortedData = [...json.data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          return [state, sortedData] as const;
        })
      );
      setCovidByState(Object.fromEntries(stateDataPairs));
    };

    fetchAllStates();
  }, []);

  const addState = (state: string) => {
    if (!selectedStates.includes(state) && selectedStates.length < MAX_STATES) {
      setSelectedStates([...selectedStates, state]);
    }
  };

  const removeState = (state: string) => {
    setSelectedStates(selectedStates.filter((st) => st !== state));
  };

  const moveState = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedStates.length) return;
    setSelectedStates((prev) =>
      prev.map((s, i) => {
        if (i === index) return prev[newIndex];
        if (i === newIndex) return prev[index];
        return s;
      })
    );
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">COVID-19 Dashboard</h1>
      <DashboardToolbar
        selectedStates={selectedStates}
        addState={addState}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        chartType={chartType}
        setChartType={setChartType}
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
          ) : null
        )}
      </div>
    </div>
  );
};

export default CovidDashboard;
