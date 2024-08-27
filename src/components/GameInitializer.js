import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

const GameInitializer = () => {
  const { sendMessage } = useWebSocket();
  const [playerName, setPlayerName] = useState('Player1');

  const initializeGame = () => {
    sendMessage({
      type: 'INIT',
      gameId: 'game123',
      playerName: playerName,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Initialize Game</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={initializeGame}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        Join Game
      </button>
    </div>
  );
};

export default GameInitializer;
