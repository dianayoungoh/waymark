// CovidChart.tsx
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

import {
  CovidData,
  ChartType,
  DisplayMode,

} from "../types/types";


type CovidChartProps = {
  data: CovidData[];
  displayMode: DisplayMode;
  chartType: ChartType;
  onHover: (data: CovidData) => void;
  onLeave: () => void;
};

type RechartsMouseEvent = {
  activePayload?: { payload?: CovidData }[];
};

// Extracts the payload from a Recharts mouse event and invokes the onHover callbackwith the corresponding CovidData point
export const handleHover = (
  e: RechartsMouseEvent,
  onHover: (data: CovidData) => void,
) => {
  const payload = e?.activePayload?.[0]?.payload;
  if (payload) onHover(payload);
};

// Formats the date string from raw data for better axis readability
const formattedDateTick = (str: string) => {
  const date = new Date(str);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const CovidChart = ({
  data,
  displayMode,
  chartType,
  onHover,
  onLeave,
}: CovidChartProps) => {
  const chartProps = {
    data,
    onMouseMove: (e: RechartsMouseEvent) => handleHover(e, onHover),
    onMouseLeave: onLeave,
  };

  // X-axis configuration shared by both chart types
  const XAxisElement = (
    <XAxis
      dataKey="date"
      tickFormatter={formattedDateTick}
      angle={-45}
      textAnchor="end"
      tick={{ fontSize: 8 }}
    ></XAxis>
  );
  
  // Y-axis configuration with vertical label
  const YAxisElement = (
    <YAxis>
      <Label
        angle={-90}
        position="insideLeft"
        style={{ textAnchor: "middle" }}
      />
    </YAxis>
  );

  // Determine which nested data field to visualize based on displayMode
  const dataKey =
    displayMode === "cases" ? "cases.total" : "outcomes.hospitalized.currently";

  return (
    <ResponsiveContainer width="100%" height={300}>
      {/*Show bar chart if chartType is "bar", otherwise show line chart*/}
      {chartType === "bar" ? (
        <BarChart
          {...chartProps}
          margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
        >
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
