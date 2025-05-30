import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * Main TicTacToe classic container.
 * Handles game logic, board state, player turns,
 * and renders the game board with the specified design.
 */
function TicTacToeClassic() {
  // Game board state: 9 cells [0-8], either "X", "O", or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // "X" always goes first
  const [xIsNext, setXIsNext] = useState(true);
  // Status: "playing", "win", or "draw"
  const [status, setStatus] = useState("playing");
  // Keep track of the winner if exists
  const [winner, setWinner] = useState(null);

  // The color palette as per requirements
  const colors = {
    primary: "#ffffff",   // background, text
    secondary: "#222222", // board lines, text
    accent: "#4caf50"     // winner mark, highlight
  };

  // PUBLIC_INTERFACE
  /**
   * Checks for a winner or draw in the current board state.
   * @param {string[]} squares
   * @returns {"X"|"O"|null|"draw"}
   */
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    if (squares.every(cell => cell)) {
      return "draw";
    }
    return null;
  }

  // PUBLIC_INTERFACE
  /**
   * Handles a click on a cell in the game board.
   * @param {number} index - Position clicked
   */
  function handleCellClick(index) {
    // Only allow play if still ongoing
    if (status !== "playing" || board[index]) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    const result = calculateWinner(newBoard);

    setBoard(newBoard);
    setXIsNext(!xIsNext);

    if (result === "X" || result === "O") {
      setStatus("win");
      setWinner(result);
    } else if (result === "draw") {
      setStatus("draw");
      setWinner(null);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Resets the game to the initial state.
   */
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("playing");
    setWinner(null);
  }

  // Status messaging
  let statusMsg;
  if (status === "win") {
    statusMsg = (
      <span style={{ color: colors.accent }}>
        Winner: Player {winner}
      </span>
    );
  } else if (status === "draw") {
    statusMsg = (
      <span style={{ color: colors.secondary }}>
        Draw! Nobody wins.
      </span>
    );
  } else {
    statusMsg = (
      <span>
        Next turn: <span style={{ color: colors.accent }}>Player {xIsNext ? "X" : "O"}</span>
      </span>
    );
  }

  // Inline styles to match palette and theme
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    background: colors.primary,
    color: colors.secondary,
    borderRadius: 12,
    boxShadow: "0 6px 24px rgba(76, 175, 80, 0.08)",
    margin: "32px auto",
    maxWidth: 400,
    padding: "32px 24px 24px 24px"
  };

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 64px)",
    gridTemplateRows: "repeat(3, 64px)",
    gap: 0,
    border: `2px solid ${colors.secondary}`,
    background: colors.primary,
    borderRadius: 8,
    margin: "16px 0"
  };
  const cellStyle = idx => ({
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.1rem",
    fontWeight: 700,
    borderRight: [2, 5, 8].includes(idx) ? "none" : `1px solid ${colors.secondary}`,
    borderBottom: idx >= 6 ? "none" : `1px solid ${colors.secondary}`,
    background: "#f6f6f6",
    cursor: status === "playing" && !board[idx] ? "pointer" : "default",
    color: 
      board[idx] === "X"
        ? (status === "win" && winner === "X" ? colors.accent : colors.secondary)
        : board[idx] === "O"
        ? (status === "win" && winner === "O" ? colors.accent : "#00695c")
        : colors.secondary,
    transition: "color 0.2s"
  });

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    color: colors.secondary,
    marginBottom: 6,
    letterSpacing: "1px"
  };

  const statusStyle = {
    fontSize: "1.12rem",
    marginBottom: 14,
    color: colors.secondary,
    minHeight: 28
  };

  const buttonStyle = {
    marginTop: 22,
    background: colors.accent,
    color: colors.primary,
    border: "none",
    borderRadius: 5,
    padding: "0.8em 2.1em",
    fontWeight: 600,
    fontSize: "1.10rem",
    boxShadow: "0 2px 10px rgba(76, 175, 80, 0.05)",
    cursor: "pointer",
    transition: "background 0.15s"
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>TicTacToe Classic</div>
      <div style={statusStyle}>{statusMsg}</div>
      <div style={boardStyle} role="grid" aria-label="TicTacToe board">
        {board.map((cell, idx) => (
          <div
            key={idx}
            style={cellStyle(idx)}
            role="button"
            tabIndex={0}
            aria-label={`Cell ${Math.floor(idx/3)+1},${(idx%3)+1} ${cell ? cell : ""}`}
            onClick={() => handleCellClick(idx)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleCellClick(idx);
            }}
            data-testid={`cell-${idx}`}
          >
            {cell}
          </div>
        ))}
      </div>
      <button
        style={buttonStyle}
        onClick={handleReset}
        data-testid="reset-btn"
        aria-label="Reset Game"
      >
        Reset Game
      </button>
    </div>
  );
}

export default TicTacToeClassic;
