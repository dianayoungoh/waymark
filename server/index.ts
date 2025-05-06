import express from "express";
import cors from "cors";
import covidRoutes from "./routes/covidRoutes";

const app = express();
app.use(cors());

app.use("/api", covidRoutes);

app.listen(4000, () => {
  console.log("API server running at http://localhost:4000");
});
