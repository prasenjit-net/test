import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Board from "./Board";

describe("Board Component", () => {
  test("renders empty board", () => {
    const handleClick = jest.fn();
    const squares = Array(9).fill(null);

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
    buttons.forEach((button) => {
      expect(button.textContent).toBe("");
    });
  });

  test("renders board with some moves", () => {
    const handleClick = jest.fn();
    const squares = ["X", null, "O", null, "X", null, "O", null, null];

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toBe("X");
    expect(buttons[2].textContent).toBe("O");
    expect(buttons[4].textContent).toBe("X");
    expect(buttons[6].textContent).toBe("O");
  });

  test("calls onClick with correct index", () => {
    const handleClick = jest.fn();
    const squares = Array(9).fill(null);

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[4]); // Click center square

    expect(handleClick).toHaveBeenCalledWith(4);
  });

  test("renders correct board layout", () => {
    const handleClick = jest.fn();
    const squares = Array(9).fill(null);

    const { container } = render(
      <Board squares={squares} onClick={handleClick} />
    );

    // Check for three rows
    const rows = container.getElementsByClassName("board-row");
    expect(rows).toHaveLength(3);

    // Each row should have 3 squares
    Array.from(rows).forEach((row) => {
      const squares = row.getElementsByClassName("square");
      expect(squares).toHaveLength(3);
    });
  });

  test("handles winning line rendering", () => {
    const handleClick = jest.fn();
    const squares = ["X", "X", "X", "O", "O", null, null, null, null];

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toBe("X");
    expect(buttons[1].textContent).toBe("X");
    expect(buttons[2].textContent).toBe("X");
  });

  test("handles full board rendering", () => {
    const handleClick = jest.fn();
    const squares = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button, index) => {
      expect(button.textContent).toBe(squares[index]);
    });
  });

  test("maintains square positions after updates", () => {
    const handleClick = jest.fn();
    const initialSquares = Array(9).fill(null);

    const { rerender } = render(
      <Board squares={initialSquares} onClick={handleClick} />
    );

    const buttons = screen.getAllByRole("button");
    const buttonPositions = buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    });

    // Update with some moves
    const updatedSquares = ["X", null, null, null, "O", null, null, null, null];

    rerender(<Board squares={updatedSquares} onClick={handleClick} />);

    // Check that positions haven't changed
    buttons.forEach((button, index) => {
      const newRect = button.getBoundingClientRect();
      expect(newRect.x).toBe(buttonPositions[index].x);
      expect(newRect.y).toBe(buttonPositions[index].y);
    });
  });

  test("handles rapid consecutive clicks", () => {
    const handleClick = jest.fn();
    const squares = Array(9).fill(null);

    render(<Board squares={squares} onClick={handleClick} />);

    const buttons = screen.getAllByRole("button");

    // Simulate rapid clicks on the same square
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);

    // onClick should be called for each click
    expect(handleClick).toHaveBeenCalledTimes(3);
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});
