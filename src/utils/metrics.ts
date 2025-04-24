import { CovidData } from "../types/types";

export const getMetricValue = (
  d: CovidData,
  displayMode: "cases" | "hospitalizations",
): number | null => {
  if (displayMode === "cases") return d.cases?.total ?? null;
  if (displayMode === "hospitalizations")
    return d.outcomes?.hospitalized?.currently ?? null;
  return null;
};

export const calculateRollingAvg = (
  dataSeries: CovidData[],
  idx: number,
  displayMode: "cases" | "hospitalizations",
): number | null => {
  if (idx < 6) return null;

  const diffs = Array.from({ length: 7 }, (_, i) => {
    const curr = getMetricValue(dataSeries[idx - i], displayMode);
    const prev = getMetricValue(dataSeries[idx - i - 1], displayMode);
    return curr != null && prev != null ? curr - prev : null;
  });

  return diffs.every((n) => n !== null)
    ? diffs.reduce((sum, n) => sum + (n as number), 0) / 7
    : null;
};
