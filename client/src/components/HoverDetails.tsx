/**
 * HoverDetails.tsx
 *
 * Displays contextual information when hovering over a chart data point.
 * Includes values like total PCR tests, hospitalization details, and
 * a computed 7-day rolling average for the selected display mode.
 *
 * Props:
 * - hoveredDate: the date currently being hovered over in the chart
 * - dataSeries: full time series for the selected state
 */
import { CovidData } from "../types/types";
import { calculateRollingAvg } from "../utils/metrics";
import { useCovid } from "../context/CovidContext";

type HoverDetailsProps = {
  hoveredDate: string | null;
  dataSeries: CovidData[];
};

const HoverDetails = ({ hoveredDate, dataSeries }: HoverDetailsProps) => {
  const { displayMode } = useCovid();

  const hoveredData = hoveredDate
    ? dataSeries.find((d) => d.date === hoveredDate)
    : null;

  if (!hoveredData)
    return <p data-testid="hover-placeholder">Hover graph to see data</p>;

  // Get index of hovered data to calculate rolling average
  const idx = dataSeries.findIndex((d) => d.date === hoveredDate);

  // Compute 7-day rolling average for new cases or hospitalizations
  const rollingAvg = calculateRollingAvg(dataSeries, idx, displayMode);

  const hosp = hoveredData.outcomes?.hospitalized;
  const pcr = hoveredData.tests?.pcr;

  // Define the list of data points to show on hover, including optional fields and computed 7-day avg
  const hoverEntries: [string, number | null | undefined][] = [
    ["Total Recovered", hoveredData.outcomes?.recovered],
    ["Total PCR Tests", pcr?.total],
    ["Currently Hospitalized", hosp?.currently],
    ["Currently in ICU", hosp?.in_icu?.currently],
    ["Currently on Ventilator", hosp?.on_ventilator?.currently],
    [
      `7-day Avg New ${displayMode === "cases" ? "Cases" : "Hospitalizations"}`,
      rollingAvg != null ? Math.round(rollingAvg) : null,
    ],
  ];

  return (
    <div className="hover-details">
      <h3 className="hover-title">{hoveredData.date}</h3>
      <ul className="hover-list">
        {hoverEntries.map(
          ([label, value]) =>
            value != null && (
              <li key={label}>
                {label}: {value}
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default HoverDetails;
