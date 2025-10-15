import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Square from "./Square";

describe("Square Component", () => {
  test("renders empty square", () => {
    const handleClick = jest.fn();
    render(<Square value={null} onClick={handleClick} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("");
  });

  test("renders X in square", () => {
    const handleClick = jest.fn();
    render(<Square value="X" onClick={handleClick} />);

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("X");
  });

  test("renders O in square", () => {
    const handleClick = jest.fn();
    render(<Square value="O" onClick={handleClick} />);

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("O");
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Square value={null} onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
