// App.jsx
import React from "react";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./config/wagmi";
import { AuthProvider } from "../src/context/AuthContext";
import DashboardPage from "./components/DashboardPage";
import { SignInWithBase } from "./components/SignInWithBase";
import LandingPage from "./components/LandingPage";
import "./index.css";

function App() {
  return (
    <WagmiProvider config={config}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </WagmiProvider>
  );
}

function Layout() {
  const { isConnected, address } = useAccount(); // ✅ using wagmi's hook

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            BatchPay
          </h1>
          <SignInWithBase />
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {isConnected ? (
          <DashboardPage userAddress={address} />
        ) : (
          <LandingPage />
        )}
      </main>
    </div>
  );
}

export default App;
