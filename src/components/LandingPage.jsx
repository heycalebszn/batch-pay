import React from 'react';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { FiZap, FiDollarSign, FiShield } from 'react-icons/fi';

const LandingPage = ({ onConnect }) => {
  const handleConnect = (address) => {
    onConnect(address);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-black">
            BatchPay
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-700">
            One-click batch USDC payroll on Base
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pay multiple employees instantly with a single transaction. 
            Save time and gas fees with atomic batch transfers.
          </p>
        </div>

        {/* Connect Wallet Section */}
        <div className="max-w-md mx-auto mb-20">
          <div className="border-2 border-black p-8 bg-white">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              Get Started
            </h2>
            <p className="text-gray-700 mb-8 text-center">
              Connect your Base wallet to start managing payroll
            </p>
            
            <div className="text-center">
              <SignInWithBaseButton 
                onConnect={handleConnect}
                className="w-full py-4 px-6 bg-black text-white font-semibold hover:bg-gray-800 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-20 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">95%</div>
            <div className="text-sm text-gray-600">Gas Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">1-Click</div>
            <div className="text-sm text-gray-600">Batch Pay</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">1000+</div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-300 p-8 bg-white hover:border-black transition-colors duration-200">
            <FiZap className="text-4xl text-black mb-6" />
            <h3 className="text-xl font-bold mb-4 text-black">
              Lightning Fast
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Atomic batch processing means all payments execute simultaneously or not at all
            </p>
          </div>
          
          <div className="border border-gray-300 p-8 bg-white hover:border-black transition-colors duration-200">
            <FiDollarSign className="text-4xl text-black mb-6" />
            <h3 className="text-xl font-bold mb-4 text-black">
              Cost Effective
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Reduce gas costs by up to 95% compared to individual transactions
            </p>
          </div>
          
          <div className="border border-gray-300 p-8 bg-white hover:border-black transition-colors duration-200">
            <FiShield className="text-4xl text-black mb-6" />
            <h3 className="text-xl font-bold mb-4 text-black">
              Secure
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Built on Base with multi-signature support and audit-proven smart contracts
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="text-gray-700 text-sm">Live on Base Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;