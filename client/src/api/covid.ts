import { CovidData } from "../types/types";

export const fetchCovidData = async (state: string): Promise<CovidData[]> => {
  const res = await fetch(
    `http://localhost:4000/api/state/${state.toLowerCase()}`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${state}`);
  }

  const json = await res.json();
  return json.data;
};
