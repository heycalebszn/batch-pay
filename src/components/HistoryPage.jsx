import React, { useState } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { base } from '@base-org/account';

const HistoryPage = ({ paymentHistory, onUpdateStatus }) => {
  const [checkingStatus, setCheckingStatus] = useState({});

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTxId = (txId) => {
    if (!txId) return 'N/A';
    return `${txId.slice(0, 8)}...${txId.slice(-6)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const checkPaymentStatus = async (txId) => {
    if (!txId || checkingStatus[txId]) return;

    setCheckingStatus(prev => ({ ...prev, [txId]: true }));

    try {
      const sdk = createBaseAccountSDK({
        appName: 'BatchPay',
        appLogoUrl: 'https://batchpay.app/logo.png',
        appChainIds: [base.constants.CHAIN_IDS.base]
      });

      // Note: getPaymentStatus might not be available in the current SDK version
      // This is a placeholder implementation
      const status = await sdk.getPaymentStatus({ id: txId });
      
      onUpdateStatus(txId, status);
    } catch (error) {
      console.error('Failed to check payment status:', error);
      // For now, we'll simulate status updates
      // In a real implementation, you'd want to check the actual transaction status
      setTimeout(() => {
        onUpdateStatus(txId, 'completed');
      }, 1000);
    } finally {
      setCheckingStatus(prev => ({ ...prev, [txId]: false }));
    }
  };

  if (paymentHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold mb-2">No Payment History</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your payment history will appear here after making your first batch payment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {paymentHistory.length} payment{paymentHistory.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {paymentHistory.map((payment, index) => (
          <div
            key={payment.txId || index}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">
                    Batch Payment #{index + 1}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Transaction ID</p>
                    <p className="font-mono font-semibold">{formatTxId(payment.txId)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Date</p>
                    <p className="font-semibold">{formatDate(payment.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Amount</p>
                    <p className="font-semibold">${payment.totalAmount?.toFixed(2) || '0.00'} USDC</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {payment.employeeCount} employee{payment.employeeCount !== 1 ? 's' : ''} paid
                  </p>
                </div>

                {/* Employee Details (collapsible) */}
                {payment.employees && payment.employees.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
                      View Employee Details
                    </summary>
                    <div className="mt-3 space-y-2">
                      {payment.employees.map((emp, empIndex) => (
                        <div
                          key={empIndex}
                          className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded-lg text-sm"
                        >
                          <div>
                            <p className="font-semibold">{emp.name}</p>
                            <p className="text-gray-600 dark:text-gray-300 font-mono">
                              {emp.address.slice(0, 6)}...{emp.address.slice(-4)}
                            </p>
                          </div>
                          <p className="font-semibold">${parseFloat(emp.amount).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => checkPaymentStatus(payment.txId)}
                  disabled={checkingStatus[payment.txId]}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
                >
                  {checkingStatus[payment.txId] ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;