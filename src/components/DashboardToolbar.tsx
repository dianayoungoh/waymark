import React, { useState } from "react";
import { ChartType, DisplayMode } from "../types/types";
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

  const displayOptions: { label: string; value: DisplayMode }[] = [
    { label: "Cases", value: "cases" },
    { label: "Hospitalizations", value: "hospitalizations" },
  ];

  const chartOptions: { label: string; value: ChartType }[] = [
    { label: "Bar", value: "bar" },
    { label: "Line", value: "line" },
  ];


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption("");
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
          {displayOptions.map(({ label, value }) => (
            <label key={value}>
              <input
                type="radio"
                name="metric"
                value={value}
                checked={displayMode === value}
                onChange={() => setDisplayMode(value)}
              />
              {label}
            </label>
          ))}
         
        </fieldset>

        <fieldset>
          <legend>Chart Type</legend>

          {chartOptions.map(({ label, value }) => (
            <label key={value}>
              <input
                type="radio"
                name="chartType"
                value={value}
                checked={chartType === value}
                onChange={() => setChartType(value)}
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
};

export default DashboardToolbar;
