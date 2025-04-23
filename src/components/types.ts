// types.ts
export type CovidData = {
    date: string;
    tests?: { pcr?: { total?: number | null } };
    outcomes?: {
      recovered?: number | null;
      hospitalized?: {
        currently?: number | null;
        in_icu?: { currently?: number | null };
        on_ventilator?: { currently?: number | null };
      };
    };
    rolling7DayAvg?: number;
  };
  
  export type ChartType = "bar" | "line";
  export type DisplayMode = "cases" | "hospitalizations";
  
  export type RechartsMouseEvent = {
    activePayload?: { payload?: CovidData }[];
  };
  