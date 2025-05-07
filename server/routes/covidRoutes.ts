/**
 * covidRoutes.ts
 *
 * Defines the API route for fetching COVID-19 data by state.
 * Delegates the request handling to the `getCovidData` controller.
 *
 * Route:
 *   GET /api/state/:state → getCovidData
 */

import { Router } from "express";
import { getCovidData } from "../controllers/covidController";

const router = Router();

router.get("/state/:state", getCovidData);

export default router;
