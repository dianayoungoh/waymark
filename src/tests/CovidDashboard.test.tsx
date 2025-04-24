import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import CovidDashboard from "../components/CovidDashboard";
import { vi } from "vitest";
import { STATES } from "../constants/constants";

// Mock API response
const mockApiData = {
  data: [
    {
      date: "2023-01-01",
      cases: { total: 100 },
      outcomes: { hospitalized: { currently: 5 } },
      tests: { pcr: { total: 200 } },
    },
    {
      date: "2023-01-02",
      cases: { total: 120 },
      outcomes: { hospitalized: { currently: 10 } },
      tests: { pcr: { total: 250 } },
    },
  ],
};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockApiData),
    })
  ) as unknown as typeof fetch;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CovidDashboard", () => {
  it("renders title and dropdown", async () => {
    await act(async () => {
      render(<CovidDashboard />);
    });

    expect(screen.getByText("COVID-19 Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("fetches state data and adds a state to the panel", async () => {
    await act(async () => {
      render(<CovidDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(STATES.length);
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: STATES[0] } });

    await waitFor(() => {
      expect(screen.getByText(STATES[0])).toBeInTheDocument();
    });

    expect(screen.getByTestId("hover-placeholder")).toBeInTheDocument();

  });

  it("fetches each state's data from the correct URL", async () => {
    await act(async () => {
      render(<CovidDashboard />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(STATES.length);
    });

    STATES.forEach((state) => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/states/${state.toLowerCase()}/daily/simple.json`)
      );
    });
  });
});
