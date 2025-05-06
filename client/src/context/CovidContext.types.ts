/**
 * CovidContext.types.ts
 *
 * Type definitions for the CovidContext and its provider.
 * Defines the shape of context state and actions used across the dashboard.
 */

import { CovidData, DisplayMode, ChartType } from "../types/types";

export type CovidContextType = {
  covidByState: Record<string, CovidData[]>;
  selectedStates: string[];
  displayMode: DisplayMode;
  chartType: ChartType;
  addState: (state: string) => void;
  removeState: (state: string) => void;
  moveState: (index: number, direction: number) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setChartType: (type: ChartType) => void;
};

export type CovidProviderProps = {
  children: React.ReactNode;
  valueOverride?: Partial<CovidContextType>;
};
