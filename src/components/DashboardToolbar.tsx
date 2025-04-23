import React, { useState } from "react";
import { ChartType, DisplayMode } from "./types";
import { STATES, MAX_STATES } from "../constants/constants";

type DashboardToolbarProps = {
  stateControl: {
    selectedStates: string[];
    addState: (state: string) => void;
  };
  displayControl: {
    displayMode: DisplayMode;
    setDisplayMode: (mode: DisplayMode) => void;
  };
  chartControl: {
    chartType: ChartType;
    setChartType: (type: ChartType) => void;
  };
};

const DashboardToolbar = ({
  stateControl,
  displayControl,
  chartControl,
}: DashboardToolbarProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const { selectedStates, addState } = stateControl;
  const { displayMode, setDisplayMode } = displayControl;
  const { chartType, setChartType } = chartControl;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption("");
  
    // Only add a state if the user selected a valid one
    if (value) {
      addState(value);
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
        {/* Dropdown to select a state; only show states that have not already been selected */}
        <option value="">Select a state</option>
        {STATES.filter((st) => !selectedStates.includes(st)).map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <div className="radio-group">
        <fieldset>
          <legend>Data Type</legend>

          {/* Show graph for cases */}

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

          {/* Show graph for hospitalizations */}

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

          {/* Bar Chart Type */}

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

          {/* Line Chart Type */}

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
