import { Router } from "express";
import { getCovidData } from "../controllers/covidController";

const router = Router();

router.get("/state/:state", getCovidData);

export default router;
