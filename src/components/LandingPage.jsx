import React from 'react';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { Shield, Eye, DollarSign } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';

const LandingPage = ({ onConnect }) => {
  const handleConnect = (address) => {
    onConnect(address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-white to-neutral-light font-inter">
      {/* Full-screen Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-24 py-48">
        
        {/* Hero Content */}
        <div className="text-center mb-48 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold font-inter text-secondary mb-24 leading-tight">
            BatchPay
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-600 mb-16 leading-relaxed">
            Payroll, Simplified
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            One-click USDC payroll on Base
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mb-48 animate-slide-up">
          <div className="bg-white rounded-modal shadow-modal p-32 border border-gray-100">
            <SignInWithBaseButton 
              onConnect={handleConnect}
              className="h-48 px-48 bg-primary text-white font-semibold font-inter text-lg rounded-button hover:bg-primary-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-32 max-w-4xl w-full animate-slide-up">
          <Card hover className="text-center p-32">
            <div className="flex justify-center mb-24">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-inter text-secondary mb-16">
              Secure
            </h3>
            <p className="text-gray-600 font-inter leading-relaxed">
              Built on Base with multi-signature support and audit-proven smart contracts
            </p>
          </Card>
          
          <Card hover className="text-center p-32">
            <div className="flex justify-center mb-24">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-inter text-secondary mb-16">
              Transparent
            </h3>
            <p className="text-gray-600 font-inter leading-relaxed">
              All transactions are visible on-chain with complete payment history and status tracking
            </p>
          </Card>
          
          <Card hover className="text-center p-32">
            <div className="flex justify-center mb-24">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-inter text-secondary mb-16">
              Cost-Efficient
            </h3>
            <p className="text-gray-600 font-inter leading-relaxed">
              Reduce gas costs by up to 95% compared to individual transactions
            </p>
          </Card>
        </div>

        {/* Bottom Status */}
        <div className="mt-48 animate-fade-in">
          <div className="inline-flex items-center space-x-8 bg-white rounded-button px-16 py-8 shadow-card border border-gray-200">
            <div className="w-8 h-8 bg-accent rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-inter text-sm font-medium">Live on Base Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;