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
import { CovidData, ChartType, DisplayMode, RechartsMouseEvent } from "./types";

type CovidChartProps = {
  data: CovidData[];
  displayMode: DisplayMode;
  chartType: ChartType;
  onHover: (data: CovidData) => void;
  onLeave: () => void;
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
  // Handles mouse hover event from Recharts chart
  // If a valid payload exists, pass the hovered data point to the onHover callback
  const handleHover = (e: RechartsMouseEvent) => {
    const payload = e?.activePayload?.[0]?.payload;
    if (payload) onHover(payload);
  };

  const chartProps = {
    data,
    onMouseMove: handleHover,
    onMouseLeave: onLeave,
  };
  return (
    <ResponsiveContainer width="100%" height={300}>
      {chartType === "bar" ? (
        <BarChart
          {...chartProps}
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
        <LineChart {...chartProps}>
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

export default CovidChart;
