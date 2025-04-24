import { calculateRollingAvg } from "../../src/utils/metrics";
import { CovidData } from "../types/types";

describe("calculateRollingAvg", () => {
  it("returns correct 7-day rolling average", () => {
    const data: CovidData[] = Array.from({ length: 8 }, (_, i) => ({
      date: `2023-01-0${i + 1}`,
      cases: { total: 100 + i * 10 }, // 100 → 170
    }));

    const result = calculateRollingAvg(data, 7, "cases");

    expect(result).toBe(10);
  });

  it("returns null when fewer than 7 previous days", () => {
    const data: CovidData[] = Array.from({ length: 6 }, (_, i) => ({
      date: `2023-01-0${i + 1}`,
      cases: { total: 100 + i * 10 },
    }));

    const result = calculateRollingAvg(data, 5, "cases");

    expect(result).toBeNull();
  });

  it("handles missing metric values", () => {
    const data: CovidData[] = Array.from({ length: 8 }, (_, i) => ({
      date: `2023-01-0${i + 1}`,
      cases: { total: i === 3 ? null : 100 + i * 10 }, // introduce a null on day 4
    }));

    const result = calculateRollingAvg(data, 7, "cases");

    expect(result).toBeNull();
  });

  it("returns correct 7-day rolling average for hospitalizations", () => {
    const data: CovidData[] = Array.from({ length: 8 }, (_, i) => ({
      date: `2023-01-0${i + 1}`,
      outcomes: {
        hospitalized: {
          currently: 200 + i * 5, // 200 → 235
        },
      },
    }));
  
    const result = calculateRollingAvg(data, 7, "hospitalizations");
  
    // Differences: 5 * 7 days = 35 → average = 5
    expect(result).toBe(5);
  });

  it("returns null if hospitalization data is missing for any of the 7 days", () => {
    const data: CovidData[] = Array.from({ length: 8 }, (_, i) => ({
      date: `2023-01-0${i + 1}`,
      outcomes: {
        hospitalized: {
          currently: i === 2 ? null : 100 + i * 10, // missing value at index 2
        },
      },
    }));
  
    const result = calculateRollingAvg(data, 7, "hospitalizations");
  
    expect(result).toBeNull();
  });

});
