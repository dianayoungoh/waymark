// HoverDetails.tsx
import { CovidData } from "./types";

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

//Get hovered data from hovered date
  const hoveredData = hoveredDate
    ? dataSeries.find((d) => d.date === hoveredDate)
    : null;

  if (!hoveredData)
    return <p className="hover-placeholder">Hover graph to see data</p>;

  // Get index of hovered data to calculate rolling average
  const idx = dataSeries.findIndex((d) => d.date === hoveredDate);

  // Extract the appropriate metric value based on display mode
  const getMetric = (d: CovidData): number | null => {
    if (displayMode === "cases") return d.cases?.total ?? null;
    if (displayMode === "hospitalizations")
      return d.outcomes?.hospitalized?.currently ?? null;
    return null;
  };
  
  // Calculate 7-day rolling average of new values for the selected metric
  const rollingAvg = (() => {
    if (idx < 6) return null;

    const diffs = Array.from({ length: 7 }, (_, i) => {
      const curr = getMetric(dataSeries[idx - i]);
      const prev = getMetric(dataSeries[idx - i - 1]);
      return curr != null && prev != null ? curr - prev : null;
    });

    return diffs.every((n) => n !== null)
      ? diffs.reduce((sum, n) => sum + (n as number), 0) / 7
      : null;
  })();

  const hosp = hoveredData.outcomes?.hospitalized;
  const pcr = hoveredData.tests?.pcr;

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
