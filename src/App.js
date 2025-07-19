import React, { useState, useEffect } from 'react';
import './App.css';

function Square({ value, onClick, playerClass }) {
  return (
    <button className={`square ${playerClass}`} onClick={onClick}>
      {value}
    </button>
  );
}


function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [mode, setMode] = useState(null); // "pvp" or "cpu"
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const winner = calculateWinner(squares);

  useEffect(() => {
  if (mode === 'cpu' && !winner && !xIsNext) {
    const bestMove = getBestMove(squares);
    if (bestMove !== null) {
      setTimeout(() => handleClick(bestMove), 500); // small delay
    }
  }
}, [squares, xIsNext, mode, winner]);

function getBestMove(board) {
  const empty = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);

  // 1. Try to win
  for (let i of empty) {
    const copy = [...board];
    copy[i] = 'O';
    if (calculateWinner(copy) === 'O') return i;
  }

  // 2. Block player from winning
  for (let i of empty) {
    const copy = [...board];
    copy[i] = 'X';
    if (calculateWinner(copy) === 'X') return i;
  }

  // 3. Pick center if available
  if (board[4] === null) return 4;

  // 4. Pick a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Pick any empty cell
  return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : null;
}


  useEffect(() => {
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (!squares.includes(null) && gameStarted) {
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    }
  }, [winner, squares]);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleStart = () => {
    if (playerX && playerO && mode) {
      setGameStarted(true);
    } else {
      alert('Enter both player names and choose a game mode!');
    }
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
    setPlayerX('');
    setPlayerO('');
    setMode(null);
    setGameStarted(false);
  };

  const status = winner
    ? `Winner: ${winner === 'X' ? playerX : playerO}`
    : squares.includes(null)
    ? `Next player: ${xIsNext ? playerX : playerO}`
    : 'Draw!';

  const renderSquare = (i) => (
  <Square
    key={i}
    value={squares[i]}
    onClick={() => handleClick(i)}
    playerClass={squares[i] === 'X' ? 'X' : squares[i] === 'O' ? 'O' : ''}
  />
);

  if (!gameStarted) {
    return (
      <div className="setup">
        <h2>Tic Tac Toe</h2>
        <input
          type="text"
          placeholder="Player X name"
          value={playerX}
          onChange={(e) => setPlayerX(e.target.value)}
        />
        <input
          type="text"
          placeholder="Player O name"
          value={playerO}
          onChange={(e) => setPlayerO(e.target.value)}
          disabled={mode === 'cpu'}
        />
        <div>
          <button onClick={() => setMode('pvp')}>2 Player</button>
          <button onClick={() => {
            setMode('cpu');
            setPlayerO('Computer');
          }}>
            Play vs CPU
          </button>
        </div>
        <button onClick={handleStart}>Start Game</button>
      </div>
    );
  }

  return (
    <div className="game">
      <h2>Tic Tac Toe</h2>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
      </div>

      <div className="scores">
        <h3>Scoreboard</h3>
        <p>{playerX} (X): {scores.X}</p>
        <p>{playerO} (O): {scores.O}</p>
        <p>Draws: {scores.draws}</p>
      </div>

      <div className="buttons">
        <button onClick={restartGame}>Restart</button>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
