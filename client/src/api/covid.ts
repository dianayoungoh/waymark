/**
 * fetchCovidData.ts
 *
 * Fetches COVID-19 data for a given U.S. state from the backend API.
 * Returns an array of daily CovidData objects.
 */

import { CovidData } from "../types/types";

export const fetchCovidData = async (state: string): Promise<CovidData[]> => {
  const response = await fetch(
    `http://localhost:4000/api/state/${state.toLowerCase()}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${state}`);
  }

  const result = await response.json();
  return result.data;
};
