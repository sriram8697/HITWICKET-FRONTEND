import React, { createContext, useContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const socket = new WebSocket('wss://https://hitwicket-backend.vercel.app/');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
