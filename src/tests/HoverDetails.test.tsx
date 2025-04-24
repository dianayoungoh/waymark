import { render, screen } from "@testing-library/react";
import HoverDetails from "../components/HoverDetails";
import "@testing-library/jest-dom";
import { CovidData } from "../types/types";

const mockData: CovidData[] = [
  {
    date: "2021-12-01",
    cases: { total: 100 },
    outcomes: {
      recovered: 80,
      hospitalized: {
        currently: 5,
        in_icu: { currently: 2 },
        on_ventilator: { currently: 1 },
      },
    },
    tests: { pcr: { total: 200 } },
  },
];

describe("HoverDetails", () => {
  it("displays correct data when hoveredDate is present", () => {
    render(
      <HoverDetails
        hoveredDate="2021-12-01"
        dataSeries={mockData}
        displayMode="cases"
      />,
    );
    // All hoverEntries
    expect(screen.getByText("Total Recovered: 80")).toBeInTheDocument();
    expect(screen.getByText("Total PCR Tests: 200")).toBeInTheDocument();
    expect(screen.getByText("Currently Hospitalized: 5")).toBeInTheDocument();
    expect(screen.getByText("Currently in ICU: 2")).toBeInTheDocument();
    expect(screen.getByText("Currently on Ventilator: 1")).toBeInTheDocument();

    // Should not show rolling average (needs at least 7 days of data)
    expect(screen.queryByText(/7-day Avg New Cases:/i)).not.toBeInTheDocument();
  });

  it("shows fallback text when no hoveredDate is provided", () => {
    render(
      <HoverDetails
        hoveredDate={null}
        dataSeries={mockData}
        displayMode="cases"
      />,
    );
    expect(screen.getByText(/Hover graph to see data/i)).toBeInTheDocument();
  });
});
