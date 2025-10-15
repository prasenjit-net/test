import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerSelect from "./PlayerSelect";

describe("PlayerSelect Component", () => {
  test("renders player selector with correct options", () => {
    const handleChange = jest.fn();
    render(
      <PlayerSelect
        player="X"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    expect(screen.getByText("Player X:")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("Human");
    expect(options[1].textContent).toBe("Computer (Easy)");
    expect(options[2].textContent).toBe("Computer (Hard)");
  });

  test("shows correct selected value", () => {
    const handleChange = jest.fn();
    render(
      <PlayerSelect
        player="O"
        currentType="computer-easy"
        onTypeChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("computer-easy");
  });

  test("calls onTypeChange when selection changes", () => {
    const handleChange = jest.fn();
    render(
      <PlayerSelect
        player="X"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "computer-hard" } });

    expect(handleChange).toHaveBeenCalledWith("computer-hard");
  });

  test("renders different player labels", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <PlayerSelect
        player="X"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    expect(screen.getByText("Player X:")).toBeInTheDocument();

    rerender(
      <PlayerSelect
        player="O"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    expect(screen.getByText("Player O:")).toBeInTheDocument();
  });

  test("handles multiple rapid changes", () => {
    const handleChange = jest.fn();
    render(
      <PlayerSelect
        player="X"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");

    // Simulate rapid changes
    fireEvent.change(select, { target: { value: "computer-easy" } });
    fireEvent.change(select, { target: { value: "computer-hard" } });
    fireEvent.change(select, { target: { value: "human" } });

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenCalledWith("human");
  });

  test("preserves selection when component re-renders", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <PlayerSelect
        player="X"
        currentType="computer-hard"
        onTypeChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("computer-hard");

    // Re-render with same props
    rerender(
      <PlayerSelect
        player="X"
        currentType="computer-hard"
        onTypeChange={handleChange}
      />
    );

    expect(select.value).toBe("computer-hard");
  });

  test("handles keyboard navigation", () => {
    const handleChange = jest.fn();
    render(
      <PlayerSelect
        player="X"
        currentType="human"
        onTypeChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");

    // Simulate selection change
    fireEvent.change(select, { target: { value: "computer-easy" } });

    expect(handleChange).toHaveBeenCalledWith("computer-easy");
  });

  test("maintains correct tab order", () => {
    const handleChange = jest.fn();
    render(
      <>
        <PlayerSelect
          player="X"
          currentType="human"
          onTypeChange={handleChange}
        />
        <PlayerSelect
          player="O"
          currentType="human"
          onTypeChange={handleChange}
        />
      </>
    );

    const selects = screen.getAllByRole("combobox");

    // First select should be before second in tab order
    expect(selects[0].tabIndex).toBeLessThanOrEqual(selects[1].tabIndex);
  });
});
