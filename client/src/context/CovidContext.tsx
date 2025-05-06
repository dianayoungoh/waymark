import { createContext, useContext, useState, ReactNode } from "react";
import { CovidData, DisplayMode, ChartType } from "../types/types";
import { MAX_STATES } from "../constants/constants";
import { fetchCovidData } from "../api/covid";

type CovidContextType = {
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

const CovidContext = createContext<CovidContextType | null>(null);
export const useCovid = () => useContext(CovidContext)!;

type CovidProviderProps = {
  children: ReactNode;
  valueOverride?: Partial<CovidContextType>;
};

export const CovidProvider = ({
  children,
  valueOverride,
}: CovidProviderProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [covidByState, setCovidByState] = useState<Record<string, CovidData[]>>(
    {},
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cases");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const addState = async (state: string) => {
    setSelectedStates((prev) => {
      if (!prev.includes(state) && prev.length < MAX_STATES) {
        return [...prev, state];
      }
      return prev;
    });

    if (!covidByState[state]) {
      try {
        const data = await fetchCovidData(state);
        setCovidByState((prev) => ({ ...prev, [state]: data }));
      } catch (err) {
        console.error(`Error fetching ${state}:`, err);
      }
    }
  };

  const removeState = (state: string) => {
    setSelectedStates((prev) => prev.filter((st) => st !== state));
  };

  const moveState = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedStates.length) return;

    setSelectedStates((prev) => {
      const updated = [...prev];
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
    ...valueOverride,
  };

  return (
    <CovidContext.Provider value={value}>{children}</CovidContext.Provider>
  );
};
