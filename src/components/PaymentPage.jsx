import React, { useState, useEffect } from 'react';
import { BasePayButton } from '@base-org/account-ui/react';
import { createBaseAccountSDK } from '@base-org/account';
import { base } from '@base-org/account';
import { parseUnits } from 'viem';
import { Users, DollarSign, CheckCircle, AlertCircle, Clock, Wallet } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import Loading from './ui/Loading';
import { useToast } from './ui/Toast';

// USDC contract address on Base mainnet
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// ERC20 ABI for transfer function
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const PaymentPage = ({ employees, onPaymentSuccess, onClose, userAddress }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [error, setError] = useState('');
  const [sdk, setSdk] = useState(null);
  const [provider, setProvider] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Initialize SDK
    const initializeSDK = async () => {
      try {
        const sdkInstance = createBaseAccountSDK({
          appName: 'BatchPay',
          appLogoUrl: 'https://batchpay.app/logo.png',
          appChainIds: [base.constants.CHAIN_IDS.base]
        });
        
        const providerInstance = sdkInstance.getProvider();
        
        setSdk(sdkInstance);
        setProvider(providerInstance);
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
        setError('Failed to initialize payment system');
        showError('Failed to initialize payment system');
      }
    };

    initializeSDK();
  }, [showError]);

  const totalAmount = employees.reduce((sum, emp) => sum + parseFloat(emp.amount || 0), 0);

  const encodeFunctionData = (abi, functionName, args) => {
    // Simple ABI encoding for transfer function
    const functionSignature = 'transfer(address,uint256)';
    const functionSelector = '0xa9059cbb'; // keccak256 of function signature
    
    // Encode address (20 bytes)
    const address = args[0].slice(2).padStart(64, '0');
    
    // Encode amount (32 bytes)
    const amount = BigInt(args[1]).toString(16).padStart(64, '0');
    
    return functionSelector + address + amount;
  };

  const sendBatchPayment = async () => {
    if (!provider || !userAddress) {
      const errorMsg = 'Provider or user address not available';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('preparing');
    setError('');

    try {
      // Check wallet capabilities
      const capabilities = await provider.request({
        method: 'wallet_getCapabilities',
        params: [userAddress]
      });

      const atomicSupported = capabilities[base.constants.CHAIN_IDS.base]?.atomicBatch?.supported || false;

      // Prepare calls for each employee
      const calls = employees.map(employee => ({
        to: USDC_ADDRESS,
        value: '0x0',
        data: encodeFunctionData(
          ERC20_ABI,
          'transfer',
          [employee.address, parseUnits(employee.amount, 6)]
        )
      }));

      // Prepare wallet_sendCalls parameters
      const params = [{
        version: '2.0.0',
        from: userAddress,
        chainId: base.constants.CHAIN_IDS.base,
        atomicRequired: atomicSupported,
        calls: calls
      }];

      setPaymentStatus('sending');

      // Send the batch transaction
      const txId = await provider.request({
        method: 'wallet_sendCalls',
        params: params
      });

      setPaymentStatus('success');
      showSuccess(`✅ Payment sent! Tx: ${txId.slice(0, 8)}...${txId.slice(-6)}`);

      // Add to payment history
      onPaymentSuccess({
        txId,
        timestamp: Date.now(),
        status: 'pending',
        employeeCount: employees.length,
        totalAmount: totalAmount,
        employees: employees.map(emp => ({ name: emp.name, address: emp.address, amount: emp.amount }))
      });

      // Close payment page after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Payment failed:', err);
      const errorMsg = err.message || 'Payment failed. Please try again.';
      setError(errorMsg);
      setPaymentStatus('error');
      showError(`❌ Payment failed: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'preparing':
        return 'Preparing batch transaction...';
      case 'sending':
        return 'Sending payment to blockchain...';
      case 'success':
        return 'Payment successful! 🎉';
      case 'error':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'preparing':
      case 'sending':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Show fullscreen loading during transaction processing
  if (isProcessing && (paymentStatus === 'preparing' || paymentStatus === 'sending')) {
    return (
      <Loading
        variant="fullscreen"
        size="large"
        message={getStatusMessage()}
      />
    );
  }

  return (
    <>
      {/* Main Payment Modal */}
      <Modal
        isOpen={!showConfirmation}
        onClose={onClose}
        title="Batch Payment"
        maxWidth="max-w-3xl"
        showCloseButton={!isProcessing}
      >
        {/* Payment Summary Card */}
        <Card className="bg-primary-50 border-primary-200 mb-24">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-lg font-bold font-inter text-primary-900">
              Payment Summary
            </h3>
            <Wallet className="w-6 h-6 text-primary-600" />
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex items-center gap-12">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-inter text-primary-700">Employees</p>
                <p className="text-2xl font-bold font-inter text-primary-900">
                  {employees.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-inter text-primary-700">Total Amount</p>
                <p className="text-2xl font-bold font-inter text-primary-900">
                  ${totalAmount.toFixed(2)} USDC
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Employee List */}
        <div className="mb-24">
          <h3 className="text-lg font-bold font-inter text-secondary mb-16">
            Payment Details
          </h3>
          <div className="space-y-8 max-h-64 overflow-y-auto border border-gray-200 rounded-card p-16">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-12 bg-gray-50 rounded-button"
              >
                <div>
                  <p className="font-semibold font-inter text-secondary">
                    {employee.name}
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                  </p>
                </div>
                <Badge variant="info">
                  ${parseFloat(employee.amount).toFixed(2)} USDC
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {paymentStatus !== 'idle' && (
          <Card className={`mb-24 ${
            paymentStatus === 'success' 
              ? 'bg-green-50 border-green-200'
              : paymentStatus === 'error'
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-12">
              {getStatusIcon()}
              <p className={`font-semibold font-inter ${
                paymentStatus === 'success' 
                  ? 'text-green-800'
                  : paymentStatus === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {getStatusMessage()}
              </p>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-24 bg-red-50 border-red-200">
            <div className="flex items-center gap-12">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 font-semibold font-inter">{error}</p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-16">
          <Button
            onClick={onClose}
            variant="ghost"
            size="medium"
            className="flex-1"
            disabled={isProcessing}
          >
            {paymentStatus === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {paymentStatus !== 'success' && (
            <Button
              onClick={() => setShowConfirmation(true)}
              variant="primary"
              size="medium"
              className="flex-1"
              disabled={isProcessing || !provider}
            >
              Confirm & Pay
            </Button>
          )}
        </div>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Payment"
        maxWidth="max-w-md"
      >
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-16">
            <Wallet className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold font-inter text-secondary mb-8">
            Confirm Batch Payment
          </h3>
          <p className="text-body font-inter text-gray-600">
            You are about to send <span className="font-semibold">${totalAmount.toFixed(2)} USDC</span> to{' '}
            <span className="font-semibold">{employees.length} employee{employees.length !== 1 ? 's' : ''}</span>.
          </p>
        </div>

        <div className="flex gap-16">
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="secondary"
            size="medium"
            className="flex-1"
          >
            Back
          </Button>
          <BasePayButton
            onPay={sendBatchPayment}
            disabled={isProcessing || !provider}
            className="flex-1 h-40 px-24 bg-primary text-white font-semibold font-inter rounded-button hover:bg-primary-600 transition-all duration-200 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Confirm & Pay'}
          </BasePayButton>
        </div>
      </Modal>
    </>
  );
};

export default PaymentPage;