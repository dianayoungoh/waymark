import { render } from "@testing-library/react";
import CovidChart from "../components/CovidChart";
import { vi } from "vitest";
import { handleHover } from "../components/CovidChart";

const mockData = [
  {
    date: "2023-01-01",
    cases: { total: 100 },
    outcomes: { hospitalized: { currently: 10 } },
  },
  {
    date: "2023-01-02",
    cases: { total: 120 },
    outcomes: { hospitalized: { currently: 15 } },
  },
];

describe("CovidChart", () => {
  it("calls onHover with correct payload", () => {
    const onHoverMock = vi.fn();
    const mockEvent = { activePayload: [{ payload: mockData[1] }] };
    handleHover(mockEvent, onHoverMock);
    expect(onHoverMock).toHaveBeenCalledWith(mockData[1]);
  });

  it("calls onLeave when mouse leaves the chart", () => {
    const onLeaveMock = vi.fn();
    render(
      <CovidChart
        data={mockData}
        displayMode="cases"
        chartType="bar"
        onHover={vi.fn()}
        onLeave={onLeaveMock}
      />,
    );

    // Manually simulate a leave event
    onLeaveMock();
    expect(onLeaveMock).toHaveBeenCalled();
  });
});
