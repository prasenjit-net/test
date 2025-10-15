import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("Tic Tac Toe App", () => {
  test("renders player selectors and empty board", () => {
    render(<App />);

    // Check for player selectors
    expect(screen.getByText("Player X:")).toBeInTheDocument();
    expect(screen.getByText("Player O:")).toBeInTheDocument();

    // Check for empty squares
    const squares = screen.getAllByRole("button");
    // 9 game squares + move history buttons
    expect(squares.length).toBeGreaterThanOrEqual(9);
  });

  test("allows human players to make moves", () => {
    render(<App />);

    // Get the first empty square
    const squares = screen.getAllByRole("button").slice(0, 9); // First 9 buttons are game squares
    fireEvent.click(squares[0]);

    // Check if X was placed
    expect(squares[0].textContent).toBe("X");

    // Make another move
    fireEvent.click(squares[1]);
    expect(squares[1].textContent).toBe("O");
  });

  test("detects a winner", async () => {
    render(<App />);

    // Get all squares
    const squares = screen.getAllByRole("button").slice(0, 9);

    // Make winning moves for X: top row
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X

    // Check for winner message
    expect(screen.getByText("Winner: X")).toBeInTheDocument();
  });

  test("allows player type changes", () => {
    render(<App />);

    // Get player type selectors
    const [playerXSelect, playerOSelect] = screen.getAllByRole("combobox");

    // Change player types
    fireEvent.change(playerXSelect, { target: { value: "computer-easy" } });
    fireEvent.change(playerOSelect, { target: { value: "computer-hard" } });

    expect((playerXSelect as HTMLSelectElement).value).toBe("computer-easy");
    expect((playerOSelect as HTMLSelectElement).value).toBe("computer-hard");
  });

  test("allows time travel through move history", () => {
    render(<App />);

    // Make some moves
    const squares = screen.getAllByRole("button").slice(0, 9);
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[1]); // O

    // Find and click "Go to game start" button
    const startButton = screen.getByText("Go to game start");
    fireEvent.click(startButton);

    // Board should be empty again
    squares.forEach((square) => {
      expect(square.textContent).toBe("");
    });
  });

  test("handles a draw game", () => {
    render(<App />);

    // Make moves that lead to a draw
    const squares = screen.getAllByRole("button").slice(0, 9);
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7]; // Draw pattern

    moves.forEach((index) => {
      fireEvent.click(squares[index]);
    });

    expect(screen.getByText("Draw!")).toBeInTheDocument();
  });

  // Edge cases
  test("prevents moves after game is won", () => {
    render(<App />);
    const squares = screen.getAllByRole("button").slice(0, 9);

    // Make winning moves for X
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X wins

    // Try to make another move
    fireEvent.click(squares[5]);

    // Square should remain empty
    expect(squares[5].textContent).toBe("");
  });

  test("handles invalid moves on occupied squares", () => {
    render(<App />);
    const squares = screen.getAllByRole("button").slice(0, 9);

    // Make a move
    fireEvent.click(squares[0]);
    expect(squares[0].textContent).toBe("X");

    // Try to click the same square again
    fireEvent.click(squares[0]);
    expect(squares[0].textContent).toBe("X"); // Should not change
  });

  // Integration tests for computer players
  test("computer makes a move after human player", async () => {
    render(<App />);

    // Set up computer player for O
    const playerOSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(playerOSelect, { target: { value: "computer-hard" } });

    // Make a human move
    const squares = screen.getAllByRole("button").slice(0, 9);
    fireEvent.click(squares[0]); // X plays center

    // Wait for computer's move
    await waitFor(
      () => {
        const filledSquares = squares.filter(
          (square) => square.textContent !== ""
        );
        expect(filledSquares.length).toBe(2);
      },
      { timeout: 1000 }
    );
  });

  test("computer vs computer game completes", async () => {
    render(<App />);

    // Set both players as computer
    const [playerXSelect, playerOSelect] = screen.getAllByRole("combobox");
    fireEvent.change(playerXSelect, { target: { value: "computer-hard" } });
    fireEvent.change(playerOSelect, { target: { value: "computer-hard" } });

    // Wait for game to complete
    await waitFor(
      () => {
        const gameEndText = screen.getByText(/Winner: [XO]|Draw!/);
        expect(gameEndText).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  test("easy mode computer makes non-optimal moves", async () => {
    render(<App />);

    // Set O as easy computer
    const playerOSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(playerOSelect, { target: { value: "computer-easy" } });

    // Array to store computer moves
    const moves: number[] = [];

    // Play 3 games
    for (let game = 0; game < 3; game++) {
      // Reset game if not first game
      if (game > 0) {
        fireEvent.click(screen.getByText("Go to game start"));
        // Wait for reset
        await waitFor(() => {
          const squares = screen.getAllByRole("button").slice(0, 9);
          return squares.every((square) => square.textContent === "");
        });
      }

      // Make first move as X
      const squares = screen.getAllByRole("button").slice(0, 9);
      fireEvent.click(squares[0]); // X plays top-left

      // Wait for computer's move and record it
      let moveIndex = -1;
      await waitFor(
        () => {
          const newSquares = screen.getAllByRole("button").slice(0, 9);
          moveIndex = newSquares.findIndex(
            (square, idx) => idx !== 0 && square.textContent === "O"
          );
          expect(moveIndex).toBeGreaterThan(-1);
        },
        { timeout: 5000 }
      );

      // Record the move
      moves.push(moveIndex);
    }

    // We should have recorded 3 computer moves
    expect(moves.length).toBe(3);

    // In easy mode, computer should make different moves across games
    const uniqueMoves = new Set(moves);
    expect(uniqueMoves.size).toBeGreaterThan(1);
  });

  test("preserves game state during time travel", () => {
    render(<App />);
    const squares = screen.getAllByRole("button").slice(0, 9);

    // Make several moves
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[1]); // X

    // Go back to first move
    fireEvent.click(screen.getByText("Go to move #1"));

    // Should show only first move
    expect(squares[0].textContent).toBe("X");
    expect(squares[4].textContent).toBe("");
    expect(squares[1].textContent).toBe("");

    // Make different moves
    fireEvent.click(squares[8]); // O
    fireEvent.click(squares[2]); // X

    // Check that new moves are preserved
    expect(squares[0].textContent).toBe("X");
    expect(squares[8].textContent).toBe("O");
    expect(squares[2].textContent).toBe("X");
  });
});
