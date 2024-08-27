import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css'; // Import the CSS file

const App = () => {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState({
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    currentPlayer: 'A',
    moveHistory: [],
    gameOver: false,
    winner: null,
  });
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://https://hitwicket-backend.vercel.app/');
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'UPDATE') {
        setGameState(data.gameState);
      } else if (data.type === 'INVALID_MOVE') {
        alert(data.message);
      } else if (data.type === 'GAME_OVER') {
        alert(`Game Over! Winner: ${data.winner}`);
      }
    };

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'INIT' }));
    };

    return () => socket.close();
  }, []);

  const handleCellClick = (row, col) => {
    if (!selectedCharacter) return;

    const move = {
      player: gameState.currentPlayer,
      row,
      col,
      character: selectedCharacter.name,
      moveType: selectedCharacter.moveType,
    };

    ws.send(JSON.stringify({ type: 'MOVE', move }));
    setSelectedCharacter(null);
    setAnimations([{ row, col, character: selectedCharacter.name }]);
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="game">
      <h1>Turn-Based Chess-like Game</h1>
      <div className="board">
        {gameState.board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${animations.some(anim => anim.row === rowIndex && anim.col === colIndex) ? 'animate-move' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell && <i className={`fa ${getIcon(cell)}`}></i>}
            </div>
          ))
        ))}
      </div>
      <div>
        <h2>Current Player: {gameState.currentPlayer}</h2>
        <div className="controls">
          <button onClick={() => handleCharacterSelect({ name: 'P1', moveType: 'L' })}>Select Pawn 1</button>
          <button onClick={() => handleCharacterSelect({ name: 'H1', moveType: 'F' })}>Select Hero1</button>
          <button onClick={() => handleCharacterSelect({ name: 'H2', moveType: 'FL' })}>Select Hero2</button>
        </div>
        {selectedCharacter && (
          <div className="selected-character">
            Selected Character: {selectedCharacter.name} - Move Type: {selectedCharacter.moveType}
          </div>
        )}
        <div>
          <h3>Move History:</h3>
          <ul>
            {gameState.moveHistory.map((move, index) => (
              <li key={index}>{move.player} - {move.character} moved to ({move.row}, {move.col})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const getIcon = (character) => {
  switch (character) {
    case 'P1':
      return 'fa-cube'; // Replace with appropriate icon for Pawn
    case 'H1':
      return 'fa-star'; // Replace with appropriate icon for Hero1
    case 'H2':
      return 'fa-heart'; // Replace with appropriate icon for Hero2
    default:
      return '';
  }
};

export default App;
