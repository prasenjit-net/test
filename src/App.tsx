import React, { useState, useEffect, useCallback } from "react";
import Board from "./components/Board";
import Modal from "./components/Modal";
import "./App.css";

type PlayerType = "human" | "computer-easy" | "computer-hard";

const App: React.FC = () => {
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [xPlayerType, setXPlayerType] = useState<PlayerType>("human");
  const [oPlayerType, setOPlayerType] = useState<PlayerType>("human");

  const calculateWinner = useCallback(
    (squares: Array<string | null>): string | null => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]
        ) {
          return squares[a];
        }
      }
      return null;
    },
    []
  );

  const findBestMove = useCallback(
    (squares: Array<string | null>): number => {
      // Helper function to evaluate board state
      const evaluate = (squares: Array<string | null>): number => {
        const winner = calculateWinner(squares);
        if (winner === "X") return 10;
        if (winner === "O") return -10;
        return 0;
      };

      // Minimax algorithm
      const minimax = (
        squares: Array<string | null>,
        depth: number,
        isMax: boolean
      ): number => {
        const score = evaluate(squares);
        if (score === 10) return score - depth;
        if (score === -10) return score + depth;
        if (!squares.includes(null)) return 0;

        if (isMax) {
          let best = -1000;
          squares.forEach((square, idx) => {
            if (square === null) {
              squares[idx] = "X";
              best = Math.max(best, minimax(squares, depth + 1, !isMax));
              squares[idx] = null;
            }
          });
          return best;
        } else {
          let best = 1000;
          squares.forEach((square, idx) => {
            if (square === null) {
              squares[idx] = "O";
              best = Math.min(best, minimax(squares, depth + 1, !isMax));
              squares[idx] = null;
            }
          });
          return best;
        }
      };

      let bestValue = xIsNext ? -1000 : 1000;
      let bestMove = -1;

      squares.forEach((square, idx) => {
        if (square === null) {
          squares[idx] = xIsNext ? "X" : "O";
          const moveValue = minimax(squares, 0, !xIsNext);
          squares[idx] = null;

          if (xIsNext && moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = idx;
          } else if (!xIsNext && moveValue < bestValue) {
            bestValue = moveValue;
            bestMove = idx;
          }
        }
      });

      return bestMove;
    },
    [calculateWinner, xIsNext]
  );

  const makeMove = useCallback(
    (i: number) => {
      const currentHistory = history.slice(0, stepNumber + 1);
      const current = currentHistory[currentHistory.length - 1];
      const squares = current.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = xIsNext ? "X" : "O";
      setHistory(currentHistory.concat([squares]));
      setStepNumber(currentHistory.length);
      setXIsNext(!xIsNext);
    },
    [history, stepNumber, xIsNext, calculateWinner]
  );

  const getRandomMove = (squares: Array<string | null>): number => {
    const availableMoves = squares
      .map((square, index) => (square === null ? index : -1))
      .filter((index) => index !== -1);

    if (availableMoves.length === 0) return -1;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const handleClick = (i: number) => {
    const currentPlayer = xIsNext ? xPlayerType : oPlayerType;
    if (currentPlayer === "human") {
      makeMove(i);
    }
  };

  useEffect(() => {
    const currentSquares = history[stepNumber];
    const currentPlayer = xIsNext ? xPlayerType : oPlayerType;

    if (
      !calculateWinner(currentSquares) &&
      stepNumber < 9 &&
      currentPlayer.startsWith("computer")
    ) {
      const isEasyMode = currentPlayer === "computer-easy";
      const delay = Math.random() * 400 + 200; // Random delay between 200-600ms

      const timeoutId = setTimeout(() => {
        let moveIndex: number;

        if (isEasyMode) {
          // 70% random moves, 30% best moves for easy mode
          moveIndex =
            Math.random() < 0.7
              ? getRandomMove(currentSquares)
              : findBestMove(currentSquares);
        } else {
          moveIndex = findBestMove(currentSquares);
        }

        if (moveIndex !== -1) {
          makeMove(moveIndex);
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [
    xIsNext,
    stepNumber,
    xPlayerType,
    oPlayerType,
    findBestMove,
    makeMove,
    history,
    calculateWinner,
  ]);

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current);

  const moves = history.map((_, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (stepNumber === 9) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleGameStart = () => {
    setIsGameStarted(true);
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  };

  const handleGameRestart = () => {
    setIsGameStarted(false);
  };

  const handleStatusClick = () => {
    if (winner || stepNumber === 9) {
      handleGameRestart();
    }
  };

  return (
    <div className="game">
      {!isGameStarted ? (
        <Modal
          onStart={handleGameStart}
          onPlayerSelectChange={(player, value) => {
            if (player === "X") {
              setXPlayerType(value as PlayerType);
            } else {
              setOPlayerType(value as PlayerType);
            }
          }}
          player1Type={xPlayerType}
          player2Type={oPlayerType}
        />
      ) : (
        <div className="game-container">
          <div className="game-header">
            <h1 className="game-title">Ultimate Tic Tac Toe</h1>
          </div>
          <div className="game-content">
            <div className="game-board">
              <Board squares={current} onClick={(i) => handleClick(i)} />
            </div>
            <div className="game-info">
              <div
                className={`status ${
                  winner ? "winner" : stepNumber === 9 ? "draw" : ""
                }`}
                onClick={handleStatusClick}
                title={
                  winner || stepNumber === 9 ? "Click to restart game" : ""
                }
              >
                {status}
                {(winner || stepNumber === 9) && (
                  <div className="restart-hint">Click to play again</div>
                )}
              </div>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
