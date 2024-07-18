import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextProps {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        
        // handle data
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ status, setStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
