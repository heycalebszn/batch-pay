import React from 'react';
import { SignInWithBaseButton } from '@base-org/account-ui/react';

const LandingPage = ({ onConnect }) => {
  const handleConnect = (address) => {
    onConnect(address);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BatchPay
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            One-click batch USDC payroll on Base
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
            Pay multiple employees instantly with a single transaction. 
            Save time and gas fees with atomic batch transfers.
          </p>
        </div>

        {/* Connect Wallet Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your Base wallet to start managing payroll
            </p>
            
            <div className="flex justify-center">
              <SignInWithBaseButton 
                onConnect={handleConnect}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Batch multiple payments into a single transaction
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">Cost Effective</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save on gas fees with atomic batch transfers
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built on Base with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;