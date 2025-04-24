import { render, screen, fireEvent } from "@testing-library/react";
import StatePanel from "../components/StatePanel";
import "@testing-library/jest-dom";
import { vi } from "vitest";

const mockData = [
  {
    date: "2023-01-01",
    cases: { total: 100 },
    outcomes: { hospitalized: { currently: 10 } },
  },
];

describe("StatePanel", () => {
  it("renders state name and hover graph default message", () => {
    render(
      <StatePanel
        stateInfo={{ name: "CA", index: 0, data: mockData }}
        displayMode="cases"
        chartType="bar"
        moveState={vi.fn()}
        removeState={vi.fn()}
      />,
    );
    expect(screen.getByText("CA")).toBeInTheDocument();
    expect(screen.getByTestId("hover-placeholder")).toBeInTheDocument();
  });

  it("calls removeState awhen ✕ button is clicked", () => {
    const removeStateMock = vi.fn();
    render(
      <StatePanel
        stateInfo={{ name: "CA", index: 0, data: mockData }}
        displayMode="cases"
        chartType="bar"
        moveState={vi.fn()}
        removeState={removeStateMock}
      />,
    );
    fireEvent.click(screen.getByText("✕"));
    expect(removeStateMock).toHaveBeenCalledWith("CA");
  });

  it("calls moveState when ↑ or ↓ is clicked", () => {
    const moveStateMock = vi.fn();
    render(
      <StatePanel
        stateInfo={{ name: "CA", index: 0, data: mockData }}
        displayMode="cases"
        chartType="bar"
        moveState={moveStateMock}
        removeState={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("↑"));
    expect(moveStateMock).toHaveBeenCalledWith(0, -1);

    fireEvent.click(screen.getByText("↓"));
    expect(moveStateMock).toHaveBeenCalledWith(0, 1);
  });
});
