/**
 * CovidContext.tsx
 *
 * Provides global state for the COVID dashboard, including:
 * - selected states
 * - per-state COVID data
 * - current display mode (cases or hospitalizations)
 * - current chart type (bar or line)
 *
 * Exposes a custom hook `useCovid` and the provider `CovidProvider`.
 */

import { createContext, useContext, useState, ReactNode } from "react";
import { CovidData, DisplayMode, ChartType } from "../types/types";
import { MAX_STATES } from "../constants/constants";
import { fetchCovidData } from "../api/covid";
import { CovidContextType, CovidProviderProps } from "./CovidContext.types";

const CovidContext = createContext<CovidContextType | null>(null);
export const useCovid = () => useContext(CovidContext)!;

export const CovidProvider = ({
  children,
}: CovidProviderProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [covidByState, setCovidByState] = useState<Record<string, CovidData[]>>(
    {},
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cases");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const addState = async (state: string) => {
    setSelectedStates((prevStates) => {
      if (!prevStates.includes(state) && prevStates.length < MAX_STATES) {
        return [...prevStates, state];
      }
      return prevStates;
    });
    // Fetch data for the new state if not already loaded
    if (!covidByState[state]) {
      try {
        const data = await fetchCovidData(state);
        setCovidByState((prevStates) => ({ ...prevStates, [state]: data }));
      } catch (err) {
        console.error(`Error fetching ${state}:`, err);
      }
    }
  };

  const removeState = (state: string) => {
    setSelectedStates((prevStates) => prevStates.filter((st) => st !== state));
  };
  // Move state up or down in the selected states list
  // direction: -1 for up, 1 for down
  const moveState = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedStates.length) return;

    setSelectedStates((prevStates) => {
      const updated = [...prevStates];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  };

  const value: CovidContextType = {
    covidByState,
    selectedStates,
    displayMode,
    chartType,
    addState,
    removeState,
    moveState,
    setDisplayMode,
    setChartType,
  };

  return (
    <CovidContext.Provider value={value}>{children}</CovidContext.Provider>
  );
};
