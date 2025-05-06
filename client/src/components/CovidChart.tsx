/**
 * CovidChart.tsx
 *
 * Reusable chart component for visualizing COVID-19 case or hospitalization data
 * using Recharts. Renders either a bar chart or line chart based on context state.
 *
 * Props:
 * - data: COVID data array for a single state
 * - onHover: callback triggered when hovering a data point
 * - onLeave: callback triggered when mouse leaves the chart area
 *
 * Context:
 * - displayMode: determines whether to show "cases" or "hospitalizations"
 * - chartType: determines whether to render a bar or line chart
 */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import { CovidData } from "../types/types";
import { useCovid } from "../context/CovidContext";

type CovidChartProps = {
  data: CovidData[];
  onHover: (data: CovidData) => void;
  onLeave: () => void;
};

type RechartsMouseEvent = {
  activePayload?: { payload?: CovidData }[];
};

// Extract and forward the hovered data point to the parent (StatePanel)
const handleHover = (
  e: RechartsMouseEvent,
  onHover: (data: CovidData) => void
) => {
  const payload = e?.activePayload?.[0]?.payload;
  if (payload) onHover(payload);
};

// Format date ticks for X-axis
const formatDate = (str: string) =>
  new Date(str).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const CovidChart = ({ data, onHover, onLeave }: CovidChartProps) => {
  const { displayMode, chartType } = useCovid();
  
  // Shared props between BarChart and LineChart
  const chartProps = {
    data,
    onMouseMove: (e: RechartsMouseEvent) => handleHover(e, onHover),
    onMouseLeave: onLeave,
    margin: { top: 20, right: 30, left: 40, bottom: 100 },
  };

  const dataKey =
    displayMode === "cases"
      ? "cases.total"
      : "outcomes.hospitalized.currently";

  const XAxisElement = (
    <XAxis
      dataKey="date"
      tickFormatter={formatDate}
      angle={-45}
      textAnchor="end"
      tick={{ fontSize: 8 }}
    />
  );

  const YAxisElement = (
    <YAxis>
      <Label
        angle={-90}
        position="insideLeft"
        style={{ textAnchor: "middle" }}
      />
    </YAxis>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      {chartType === "bar" ? (
        <BarChart {...chartProps}>
          {XAxisElement}
          {YAxisElement}
          <Tooltip />
          <Bar dataKey={dataKey} fill="#8884d8" />
        </BarChart>
      ) : (
        <LineChart {...chartProps}>
          {XAxisElement}
          {YAxisElement}
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

export default CovidChart;
