import { render, screen, fireEvent } from "@testing-library/react";
import DashboardToolbar from "../components/DashboardToolbar";
import { STATES, MAX_STATES } from "../constants/constants";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("DashboardToolbar", () => {
  it("renders only unselected states in dropdown", () => {
    const addState = vi.fn();
    render(
      <DashboardToolbar
        stateControl={{ selectedStates: ["CA", "NY"], addState }}
        displayControl={{ displayMode: "cases", setDisplayMode: vi.fn() }}
        chartControl={{ chartType: "bar", setChartType: vi.fn() }}
      />
    );
    //Ensure none of the options in the select dropdown include the selected states
    const options = screen.getAllByRole("option");
    const optionValues = options.map((opt) => opt.textContent);
    expect(optionValues).not.toContain("CA");
    expect(optionValues).not.toContain("NY");
  });

  it("calls addState when a state is selected", () => {
    const addState = vi.fn();
    render(
      <DashboardToolbar
        stateControl={{ selectedStates: [], addState }}
        displayControl={{ displayMode: "cases", setDisplayMode: vi.fn() }}
        chartControl={{ chartType: "bar", setChartType: vi.fn() }}
      />
    );
    //"combobox" is how screen readers refer to dropdowns.
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: STATES[0] },
    });

    expect(addState).toHaveBeenCalledWith(STATES[0]);
  });

  it("disables dropdown when MAX_STATES is reached", () => {
    render(
      <DashboardToolbar
        stateControl={{
            selectedStates: STATES.slice(0, MAX_STATES),
            addState: vi.fn(),
        }}
        displayControl={{ displayMode: "cases", setDisplayMode: vi.fn() }}
        chartControl={{ chartType: "bar", setChartType: vi.fn() }}
      />
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("toggles display mode radios", () => {
    //Cases radio button is checked by default
    const setDisplayMode = vi.fn();
    render(
      <DashboardToolbar
        stateControl={{ selectedStates: [], addState: vi.fn() }}
        displayControl={{ displayMode: "cases", setDisplayMode }}
        chartControl={{ chartType: "bar", setChartType: vi.fn() }}
      />
    );
    // Toggle the radio button by selecting hospitalizations
    fireEvent.click(screen.getByLabelText("Hospitalizations"));
    expect(setDisplayMode).toHaveBeenCalledWith("hospitalizations");

    
  });

  it("toggles chart type radios", () => {

    //Bar chart radio button is checked by default
    const setChartType = vi.fn();
    render(
      <DashboardToolbar
        stateControl={{ selectedStates: [], addState: vi.fn() }}
        displayControl={{ displayMode: "cases", setDisplayMode: vi.fn() }}
        chartControl={{ chartType: "bar", setChartType }}
      />
    );
    //Toggle the chart type by selecting line
    fireEvent.click(screen.getByLabelText("Line"));
    expect(setChartType).toHaveBeenCalledWith("line");
  });
});
