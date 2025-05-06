/**
 * getCovidData.ts
 *
 * Express route handler for fetching COVID-19 data for a given U.S. state.
 * Delegates the actual data retrieval to the covidService layer.
 *
 * Route: GET /api/state/:state
 */

import { Request, Response } from "express";
import { fetchCovidData } from "../services/covidService";

export const getCovidData = async (req: Request, res: Response) => {
  const { state } = req.params;
  try {
    const sortedData = await fetchCovidData(state);
    res.json({ data: sortedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch COVID data" });
  }
};
