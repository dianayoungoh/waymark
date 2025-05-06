/**
 * DashboardToolbar.tsx
 *
 * Renders UI controls for the COVID-19 dashboard.
 * Includes a dropdown to select states and radio inputs to toggle
 * between chart types (bar/line) and data metrics (cases/hospitalizations).
 * State is synced via CovidContext.
 */

import { useState } from "react";
import { STATES, MAX_STATES } from "../constants/constants";
import { ChartType, DisplayMode } from "../types/types";
import { useCovid } from "../context/CovidContext";

const DashboardToolbar = () => {
  const {
    selectedStates,
    addState,
    displayMode,
    setDisplayMode,
    chartType,
    setChartType,
  } = useCovid();

  const [selectedOption, setSelectedOption] = useState("");

  const metricOptions: { label: string; value: DisplayMode }[] = [
    { label: "Cases", value: "cases" },
    { label: "Hospitalizations", value: "hospitalizations" },
  ];

  const chartOptions: { label: string; value: ChartType }[] = [
    { label: "Bar", value: "bar" },
    { label: "Line", value: "line" },
  ];

  // When user selects a state, reset dropdown and call addState
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption("");
    if (value) addState(value);
  };

  return (
    <div className="dashboard-controls">
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        disabled={selectedStates.length >= MAX_STATES} // Disable if max states reached
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
      {/*Radio toggle to view graph according to cases or hospitalizations */}
      <div className="radio-group">
        <fieldset>
          <legend>Data Type</legend>
          {metricOptions.map(({ label, value }) => (
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
        {/*Radio toggle to view graph according to bar or line */}
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
