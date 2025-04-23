// DashboardToolbar.tsx
import React, { useState } from "react";
import { ChartType, DisplayMode } from "./types";

type DashboardToolbarProps = {
  selectedStates: string[];
  addState: (state: string) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
};

const STATES = ["TN", "WA", "MD", "OH", "FL", "AZ", "WI", "RI", "GA", "KY"];
const MAX_STATES = 5;

const DashboardToolbar = ({
  selectedStates,
  addState,
  displayMode,
  setDisplayMode,
  chartType,
  setChartType,
}: DashboardToolbarProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value) {
      addState(value);
      setSelectedOption("");
    }
  };

  return (
    <div className="dashboard-controls">
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        disabled={selectedStates.length >= MAX_STATES}
        className="state-select"
      >
        <option value="">Select a state</option>
        {STATES.filter((s) => !selectedStates.includes(s)).map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <div className="radio-group">
        <fieldset>
          <legend>Data Type</legend>
          <label>
            <input
              type="radio"
              name="metric"
              value="cases"
              checked={displayMode === "cases"}
              onChange={() => setDisplayMode("cases")}
            />
            Cases
          </label>
          <label>
            <input
              type="radio"
              name="metric"
              value="hospitalizations"
              checked={displayMode === "hospitalizations"}
              onChange={() => setDisplayMode("hospitalizations")}
            />
            Hospitalizations
          </label>
        </fieldset>

        <fieldset>
          <legend>Chart Type</legend>
          <label>
            <input
              type="radio"
              name="chartType"
              value="bar"
              checked={chartType === "bar"}
              onChange={() => setChartType("bar")}
            />
            Bar
          </label>
          <label>
            <input
              type="radio"
              name="chartType"
              value="line"
              checked={chartType === "line"}
              onChange={() => setChartType("line")}
            />
            Line
          </label>
        </fieldset>
      </div>
    </div>
  );
};

export default DashboardToolbar;
