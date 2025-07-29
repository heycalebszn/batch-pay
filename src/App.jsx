import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import './App.css';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('batchpay-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('batchpay-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleConnect = (address) => {
    setIsConnected(true);
    setUserAddress(address);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserAddress('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-100 text-gray-600'
        } shadow-lg z-50`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <LandingPage onConnect={handleConnect} />
        ) : (
          <DashboardPage 
            userAddress={userAddress} 
            onDisconnect={handleDisconnect}
          />
        )}
      </div>
    </div>
  );
};

export default App;
