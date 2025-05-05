// StatePanel.tsx
import { useState } from "react";
import CovidChart from "./CovidChart";
import HoverDetails from "./HoverDetails";
import { CovidData, DisplayMode, ChartType } from "../types/types";

type StatePanelProps = {
  stateInfo: {
    name: string;
    index: number;
    data: CovidData[];
  };
  displayMode: DisplayMode;
  chartType: ChartType;
  moveState: (index: number, direction: number) => void;
  removeState: (name: string) => void;
};

const StatePanel = ({
  stateInfo: { name, index, data },
  displayMode,
  chartType,
  moveState,
  removeState,
}: StatePanelProps) => {
  const [hover, setHover] = useState<CovidData | null>(null); // Track hovered data point for this panel

  const handleMoveUp = () => moveState(index, -1);
  const handleMoveDown = () => moveState(index, 1);
  const handleRemove = () => removeState(name);

  return (
    <div className="state-panel">
      {/* Panel Header: State name and action buttons */}
      <div className="panel-header">
        <h2 className="state-name">{name}</h2>
        <div className="panel-actions">
          <button className="action-btn" onClick={handleMoveUp}>
            ↑
          </button>
          <button className="action-btn" onClick={handleMoveDown}>
            ↓
          </button>
          <button className="action-btn remove" onClick={handleRemove}>
            ✕
          </button>
        </div>
      </div>
      {/* Panel Content: Hover details and chart */}
      <div className="panel-content">
        {/* Hover details column */}
        {/* Left column: Shows metrics for hovered date */}
        <div className="hover-col">
          <HoverDetails
            hoveredDate={hover?.date ?? null}
            dataSeries={data}
            displayMode={displayMode}
          />
        </div>

        {/* Covid Chart*/}
        <div className="chart-col">
          <CovidChart
            data={data}
            displayMode={displayMode}
            chartType={chartType}
            onHover={setHover} // Update hover state on mouse move
            onLeave={() => setHover(null)} // Clear hover state on mouse leave
          />
        </div>
      </div>
    </div>
  );
};

export default StatePanel;
