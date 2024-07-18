import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
