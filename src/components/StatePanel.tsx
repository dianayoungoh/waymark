// StatePanel.tsx
import  { useState } from "react";
import CovidChart from "./CovidChart";
import HoverDetails from "./HoverDetails";
import { CovidData, DisplayMode, ChartType } from "./types";

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
  const [hover, setHover] = useState<CovidData | null>(null);

  return (
    <div className="state-panel">
      <div className="panel-header">
        <h2 className="state-name">{name}</h2>
        <div className="panel-actions">
          <button className="action-btn" onClick={() => moveState(index, -1)}>↑</button>
          <button className="action-btn" onClick={() => moveState(index, 1)}>↓</button>
          <button className="action-btn remove" onClick={() => removeState(name)}>✕</button>
        </div>
      </div>
      <div className="panel-content">
        {/* Hover details column */}
        <div className="hover-col">
          <HoverDetails hoveredDate={hover?.date ?? null} dataSeries={data} displayMode={displayMode}/>
        </div>
        {/* Covid Chart*/}

        <div className="chart-col">
          <CovidChart
            data={data}
            displayMode={displayMode}
            chartType={chartType}
            onHover={setHover}
            onLeave={() => setHover(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default StatePanel;
