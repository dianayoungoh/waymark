import { CovidData } from "../types/types";

//Extracts the appropriate metric value from a CovidData object
//based on the selected display mode (cases or hospitalizations).

export const getMetricValue = (
  d: CovidData,
  displayMode: "cases" | "hospitalizations",
): number | null => {
  if (!d) return null;

  if (displayMode === "cases") return d.cases?.total ?? null;
  if (displayMode === "hospitalizations")
    return d.outcomes?.hospitalized?.currently ?? null;
  return null;
};

// Calculates a 7-day rolling average of the *daily difference* in metric values.

export const calculateRollingAvg = (
  dataSeries: CovidData[],
  idx: number,
  displayMode: "cases" | "hospitalizations",
): number | null => {
  if (idx < 6) return null;

  // Compute daily differences over the past 7 days
  const diffs = Array.from({ length: 7 }, (_, i) => {
    const curr = getMetricValue(dataSeries[idx - i], displayMode);
    const prev = getMetricValue(dataSeries[idx - i - 1], displayMode);
    return curr != null && prev != null ? curr - prev : null;
  });

  // Return average if all differences are non-null, otherwise null

  return diffs.every((n) => n !== null)
    ? diffs.reduce((sum, n) => sum + (n as number), 0) / 7
    : null;
};
