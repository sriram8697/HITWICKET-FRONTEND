import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

const GameBoard = () => {
  const { messages, sendMessage } = useWebSocket();
  const [board, setBoard] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('');
  const [playerName, setPlayerName] = useState('Player1'); // Or 'Player2'

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      if (lastMessage.type === 'START' || lastMessage.type === 'UPDATE') {
        setBoard(lastMessage.board);
        setCurrentTurn(lastMessage.turn);
      } else if (lastMessage.type === 'GAME_OVER') {
        alert(`Game Over! Winner: ${lastMessage.winner}`);
      }
    }
  }, [messages]);

  const handleMove = (from, to) => {
    sendMessage({
      type: 'MOVE',
      gameId: 'game123',
      playerName: playerName,
      move: { from, to },
    });
  };

  const renderCell = (row, col, piece) => {
    return (
      <div
        key={`${row}-${col}`}
        className="border border-gray-500 w-16 h-16 flex items-center justify-center"
        onClick={() => handleMove(/* from position */ /* to position */)}
      >
        {piece}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Turn: {currentTurn}</h1>
      <div className="grid grid-cols-5 gap-2">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => renderCell(rowIndex, colIndex, piece))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
