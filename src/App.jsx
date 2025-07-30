import React, { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import "./App.css";
import { FiMoon, FiSun } from "react-icons/fi";
import { useAccount } from "wagmi";


const App = () => {
  const { isConnected, address } = useAccount();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("batchpay-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("batchpay-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
            : "bg-white hover:bg-gray-100 text-gray-600"
        } shadow-lg z-50`}
      >
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </button>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <LandingPage />
        ) : (
          <DashboardPage userAddress={address} />
        )}
      </div>
    </div>
  );
};

export default App;
