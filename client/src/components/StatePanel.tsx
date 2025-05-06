/**
 * StatePanel.tsx
 *
 * Renders a single panel for a selected state, showing:
 * - Header with the state name and controls to move/remove the panel
 * - A column of hover details for the currently hovered date
 * - A COVID-19 chart for the state's case/hospitalization data
 *
 * Props:
 * - stateInfo: includes name, position in the list, and COVID data array
 *
 * Context:
 * - moveState: reorders the state in the selected list
 * - removeState: removes the state from the dashboard
 */

import { useState } from "react";
import CovidChart from "./CovidChart";
import HoverDetails from "./HoverDetails";
import { CovidData } from "../types/types";
import { useCovid } from "../context/CovidContext";

type StatePanelProps = {
  stateInfo: {
    name: string;
    index: number;
    data: CovidData[];
  };
};

const StatePanel = ({ stateInfo: { name, index, data } }: StatePanelProps) => {
  const {
    moveState,
    removeState,
  } = useCovid();

  const [hover, setHover] = useState<CovidData | null>(null);

  const handleMoveUp = () => moveState(index, -1);
  const handleMoveDown = () => moveState(index, 1);
  const handleRemove = () => removeState(name);

  return (
    <div className="state-panel">
      {/* Panel Header: State name and action buttons */}
      <div className="panel-header">
        <h2 className="state-name">{name}</h2>
        <div className="panel-actions">
          <button className="action-btn" onClick={handleMoveUp}>↑</button>
          <button className="action-btn" onClick={handleMoveDown}>↓</button>
          <button className="action-btn remove" onClick={handleRemove}>✕</button>
        </div>
      </div>
      {/* Panel Content: Hover details and chart */}
      <div className="panel-content">
        {/* Hover details column */}
        <div className="hover-col">
          <HoverDetails
            hoveredDate={hover?.date ?? null}
            dataSeries={data}
          />
        </div>

        {/* Covid Chart*/}
        <div className="chart-col">
          <CovidChart
            data={data}
            onHover={setHover}
            onLeave={() => setHover(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default StatePanel;
