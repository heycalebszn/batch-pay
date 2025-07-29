import React, { useState, useEffect } from 'react';
import { BasePayButton } from '@base-org/account-ui/react';
import { createBaseAccountSDK } from '@base-org/account';
import { base } from '@base-org/account';
import { parseUnits } from 'viem';

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
      }
    };

    initializeSDK();
  }, []);

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
      setError('Provider or user address not available');
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
      setError(err.message || 'Payment failed. Please try again.');
      setPaymentStatus('error');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Batch Payment</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Payment Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">Employees</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {employees.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">Total Amount</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                ${totalAmount.toFixed(2)} USDC
              </p>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{employee.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                    {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${parseFloat(employee.amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">USDC</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {paymentStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg ${
            paymentStatus === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : paymentStatus === 'error'
              ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          }`}>
            <p className={`font-semibold ${
              paymentStatus === 'success' 
                ? 'text-green-800 dark:text-green-200'
                : paymentStatus === 'error'
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {getStatusMessage()}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-semibold">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <BasePayButton
            onPay={sendBatchPayment}
            disabled={isProcessing || !provider}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Pay ${employees.length} Employees`}
          </BasePayButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;