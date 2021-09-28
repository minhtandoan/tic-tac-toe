import "./Game.css";
import Board from "./Component/Board";
import { useState } from "react";

function Game() {
  const boardInit = [];
  for (let i = 0; i < 3; i++) {
    const boardRow = [];
    for (let j = 0; j < 3; j++) {
      boardRow.push({ value: null, isHighLight: false });
    }
    boardInit.push(boardRow);
  }
  const [history, setHistory] = useState([
    {
      board: boardInit,
      stepNumber: 0,
      xIsNext: true,
      lastPosition: { row: null, col: null }
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [current, setCurrent] = useState(history[history.length - 1]);
  const [isDescending, setIsDescending] = useState(false);

  const calculateWinter = (board) => {
    const lines = [
      [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
      [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
      [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
      [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
      [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
      [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
      [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
      [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a.r][a.c].value
        && board[a.r][a.c].value === board[b.r][b.c].value
        && board[b.r][b.c].value === board[c.r][c.c].value) {
        board[a.r][a.c].isHighLight = true;
        board[b.r][b.c].isHighLight = true;
        board[c.r][c.c].isHighLight = true;
        return board[a.r][a.c].value;
      }
    }
    return null;
  };

  const handleClick = (r, c) => {
    if (current.board[r][c].value) {
      return;
    }
    const newHistory = history.slice(0, current.stepNumber + 1);
    const currentBoard = JSON.parse(JSON.stringify(current.board));
    currentBoard[r][c].value = current.xIsNext ? "X" : "O";
    const newStep = {
      board: currentBoard,
      stepNumber: current.stepNumber + 1,
      xIsNext: !current.xIsNext,
      lastPosition: { row: r, col: c }
    };

    const winner = calculateWinter(newStep.board);
    if (winner) {
      setStatus("Winner: " + winner);
      setIsPlaying(false);
    } else if (newStep.stepNumber === 9) {
      setStatus("Tie");
      setIsPlaying(false);
    } else {
      setStatus("Next player: " + (newStep.xIsNext ? "X" : "O"));
    }

    setHistory(newHistory.concat(newStep));
    setCurrent(newStep);
  };

  const jumpTo = (move) => {
    const descStep = { ...history.find((step => step.stepNumber === move)) };
    setCurrent(descStep);
    const winner = calculateWinter(descStep.board);
    if (winner) {
      setStatus("Winner: " + winner);
      setIsPlaying(false);
    } else if (descStep.stepNumber === 9) {
      setStatus("Tie");
      setIsPlaying(false);
    } else {
      setStatus("Next player: " + (descStep.xIsNext ? "X" : "O"));
      setIsPlaying(true);
    }
  };

  const moves = () => {
    const sortedHistory = isDescending ? history.slice().reverse() : history;
    return sortedHistory.map((step) => {
      const desc = step.stepNumber ?
        (`Go to move #${step.stepNumber} ${step.xIsNext ? "O" : "X"}(${step.lastPosition.col + 1},${step.lastPosition.row + 1})`) :
        "Go to game start";
      return (
        <li key={step.stepNumber}>
          <button className={`move${step.stepNumber === current.stepNumber ? " move--current" : ""}`}
                  onClick={() => jumpTo(step.stepNumber)}>
            {desc}
          </button>
        </li>
      );
    });
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board board={current.board} onClick={(r, c) => handleClick(r, c)} isPlaying={isPlaying}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div className="sort">
          <label className="switch">
            <input type="checkbox" onChange={() => setIsDescending(!isDescending)}/>
            <span className="slider round"/>
          </label>
          <p className="sort-label">Sort descending</p>
        </div>
        <ol>{moves()}</ol>
      </div>
    </div>
  );
}

export default Game;
