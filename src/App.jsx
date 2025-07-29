import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import { ToastProvider } from './components/ui/Toast';
import './App.css';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  const handleConnect = (address) => {
    setIsConnected(true);
    setUserAddress(address);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserAddress('');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-light font-inter">
        {!isConnected ? (
          <LandingPage onConnect={handleConnect} />
        ) : (
          <DashboardPage 
            userAddress={userAddress} 
            onDisconnect={handleDisconnect}
          />
        )}
      </div>
    </ToastProvider>
  );
};

export default App;
