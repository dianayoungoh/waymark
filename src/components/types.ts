// types.ts
export type CovidData = {
    date: string;
    cases?: { total?: number | null };
    tests?: { pcr?: { total?: number | null } };
    outcomes?: {
      recovered?: number | null;
      hospitalized?: {
        currently?: number | null;
        in_icu?: { currently?: number | null };
        on_ventilator?: { currently?: number | null };
      };
    };
   
  };
  
  export type ChartType = "bar" | "line";
  export type DisplayMode = "cases" | "hospitalizations";
  
  export type RechartsMouseEvent = {
    activePayload?: { payload?: CovidData }[];
  };
  