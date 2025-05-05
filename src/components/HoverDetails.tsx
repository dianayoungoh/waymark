// HoverDetails.tsx
import { CovidData } from "../types/types";
import { calculateRollingAvg } from "../utils/metrics";

type HoverDetailsProps = {
  hoveredDate: string | null;
  dataSeries: CovidData[];
  displayMode: "cases" | "hospitalizations";
};

const HoverDetails = ({
  hoveredDate,
  dataSeries,
  displayMode,
}: HoverDetailsProps) => {

  // Try to find the full data object for the hovered date
  const hoveredData = hoveredDate
    ? dataSeries.find((d) => d.date === hoveredDate)
    : null;

  if (!hoveredData)
    return <p data-testid="hover-placeholder">Hover graph to see data</p>;

  // Get index of hovered data to calculate rolling average
  const idx = dataSeries.findIndex((d) => d.date === hoveredDate);

  // Compute 7-day rolling average for new cases or hospitalizations
  const rollingAvg = calculateRollingAvg(dataSeries, idx, displayMode);

  // Extract optional hospitalization and PCR test details from nested data
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
            ),
        )}
      </ul>
    </div>
  );
};

export default HoverDetails;
