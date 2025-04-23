import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const STATES = ["TN", "WA", "MD", "OH", "FL", "AZ", "WI", "RI", "GA", "KY"];
const MAX_STATES = 5;

type CovidData = {
  date: string;
  tests?: {
    pcr?: {
      total?: number | null;
    };
  };
  outcomes?: {
    recovered?: number | null;
    hospitalized?: {
      currently?: number | null;
      in_icu?: {
        currently?: number | null;
      };
      on_ventilator?: {
        currently?: number | null;
      };
    };
  };
  rolling7DayAvg?: number;
};

type RechartsMouseEvent = {
  activePayload?: { payload?: CovidData }[];
};

type CovidChartProps = {
  data: CovidData[];
  displayMode: "cases" | "hospitalizations";
  chartType: "bar" | "line";
  onHover: (data: CovidData) => void;
  onLeave: () => void;
};

type HoverDetailsProps = {
  data: CovidData | null;
};

type DashboardControlsProps = {
  selectedStates: string[];
  addState: (state: string) => void;
  displayMode: "cases" | "hospitalizations";
  setDisplayMode: (mode: "cases" | "hospitalizations") => void;
  chartType: "bar" | "line";
  setChartType: (type: "bar" | "line") => void;
};

type StatePanelProps = {
  stateInfo: {
    name: string;
    index: number;
    data: CovidData[];
  };
  displayMode: "cases" | "hospitalizations";
  chartType: "bar" | "line";
  moveState: (index: number, direction: number) => void;
  removeState: (name: string) => void;
};

const HoverDetails = ({ data }: HoverDetailsProps) => {
  if (!data) {
    return <p className="hover-placeholder">Hover graph to see data</p>;
  }

  const hosp = data.outcomes?.hospitalized;
  const pcr = data.tests?.pcr;

  const hoverEntries: [string, number | null | undefined][] = [
    ["Total Recovered", data.outcomes?.recovered],
    ["Total PCR Tests", pcr?.total],
    ["Currently Hospitalized", hosp?.currently],
    ["Currently in ICU", hosp?.in_icu?.currently],
    ["Currently on Ventilator", hosp?.on_ventilator?.currently],
  ];

  return (
    <div className="hover-details">
      <h3 className="hover-title">{data.date}</h3>
      <ul className="hover-list">
        {hoverEntries.map(
          ([label, value]) =>
            value !== undefined &&
            value !== null && (
              <li key={label}>
                {label}: {value}
              </li>
            )
        )}
      </ul>
    </div>
  );
};

const CovidChart = ({
  data,
  displayMode,
  chartType,
  onHover,
  onLeave,
}: CovidChartProps) => {
  const dataKey =
    displayMode === "cases" ? "cases.total" : "outcomes.hospitalized.currently";

  const handleHover = (e: RechartsMouseEvent) => {
    if (e && e.activePayload && e.activePayload[0]?.payload) {
      onHover(e.activePayload[0].payload);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      {chartType === "bar" ? (
        <BarChart
          data={data}
          onMouseMove={handleHover}
          onMouseLeave={onLeave}
          margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
        >
          <XAxis tick={false}>
            <Label value="Date" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey={dataKey} fill="#8884d8" />
        </BarChart>
      ) : (
        <LineChart
          data={data}
          onMouseMove={handleHover}
          onMouseLeave={onLeave}
        >
          <XAxis tick={false}>
            <Label value="Date" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#82ca9d"
            dot={false}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

const DashboardToolbar = ({
  selectedStates,
  addState,
  displayMode,
  setDisplayMode,
  chartType,
  setChartType,
}: DashboardControlsProps) => {
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
          <option key={state} value={state}>
            {state}
          </option>
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
          <button className="action-btn" onClick={() => moveState(index, -1)}>
            ↑
          </button>
          <button className="action-btn" onClick={() => moveState(index, 1)}>
            ↓
          </button>
          <button
            className="action-btn destructive"
            onClick={() => removeState(name)}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="panel-content">
        <div className="hover-col">
          <HoverDetails data={hover} />
        </div>
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

const CovidDashboard = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [covidByState, setCovidByState] = useState<
    Record<string, CovidData[]>
  >({});
  const [displayMode, setDisplayMode] = useState<
    "cases" | "hospitalizations"
  >("cases");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

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

      const fullDataMap = Object.fromEntries(stateDataPairs);
      setCovidByState(fullDataMap);
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
        {selectedStates.map((state, index) => (
          <StatePanel
            key={state}
            stateInfo={{ name: state, index, data: covidByState[state] }}
            displayMode={displayMode}
            chartType={chartType}
            moveState={moveState}
            removeState={removeState}
          />
        ))}
      </div>
    </div>
  );
};

export default CovidDashboard;
