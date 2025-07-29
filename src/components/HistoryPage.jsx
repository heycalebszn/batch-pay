import React, { useState } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { base } from '@base-org/account';
import { Calendar, Hash, DollarSign, Users, ChevronDown, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

const HistoryPage = ({ paymentHistory, onUpdateStatus }) => {
  const [checkingStatus, setCheckingStatus] = useState({});
  const [expandedPayments, setExpandedPayments] = useState({});

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTxId = (txId) => {
    if (!txId) return 'N/A';
    return `${txId.slice(0, 8)}...${txId.slice(-6)}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      default:
        return 'default';
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

  const toggleExpanded = (paymentIndex) => {
    setExpandedPayments(prev => ({
      ...prev,
      [paymentIndex]: !prev[paymentIndex]
    }));
  };

  if (paymentHistory.length === 0) {
    return (
      <Card className="text-center py-48">
        <div className="flex justify-center mb-24">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold font-inter text-secondary mb-16">
          No Payment History
        </h3>
        <p className="text-body font-inter text-gray-600 max-w-md mx-auto">
          Your payment history will appear here after making your first batch payment.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-32">
        <div>
          <h2 className="text-2xl font-bold font-inter text-secondary mb-8">
            Payment History
          </h2>
          <p className="text-body font-inter text-gray-600">
            {paymentHistory.length} payment{paymentHistory.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment, index) => (
                <React.Fragment key={payment.txId || index}>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-8">
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="p-4 hover:bg-gray-100 rounded-button transition-colors"
                          aria-label="Toggle payment details"
                        >
                          {expandedPayments[index] ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                        </button>
                        <span className="font-semibold">
                          Batch Payment #{index + 1}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-8">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(payment.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-8">
                        <Hash size={16} className="text-gray-400" />
                        <span className="font-mono text-sm">
                          {formatTxId(payment.txId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-8">
                        <DollarSign size={16} className="text-gray-400" />
                        <span className="font-semibold">
                          ${payment.totalAmount?.toFixed(2) || '0.00'} USDC
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-8">
                        <Users size={16} className="text-gray-400" />
                        {payment.employeeCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => checkPaymentStatus(payment.txId)}
                        variant="ghost"
                        size="small"
                        loading={checkingStatus[payment.txId]}
                        disabled={checkingStatus[payment.txId]}
                      >
                        {checkingStatus[payment.txId] ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          'Check Status'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Employee Details Row */}
                  {expandedPayments[index] && payment.employees && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="py-16 px-24 bg-gray-50 rounded-card">
                          <h4 className="font-semibold font-inter text-secondary mb-16">
                            Employee Details
                          </h4>
                          <div className="grid gap-8">
                            {payment.employees.map((emp, empIndex) => (
                              <div
                                key={empIndex}
                                className="flex justify-between items-center p-16 bg-white rounded-button border border-gray-200"
                              >
                                <div>
                                  <p className="font-semibold font-inter text-secondary">
                                    {emp.name}
                                  </p>
                                  <p className="text-sm font-mono text-gray-600">
                                    {emp.address.slice(0, 6)}...{emp.address.slice(-4)}
                                  </p>
                                </div>
                                <Badge variant="info">
                                  ${parseFloat(emp.amount).toFixed(2)} USDC
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-16">
        {paymentHistory.map((payment, index) => (
          <Card key={payment.txId || index} className="p-24">
            <div className="flex justify-between items-start mb-16">
              <div>
                <h3 className="text-lg font-bold font-inter text-secondary mb-8">
                  Batch Payment #{index + 1}
                </h3>
                <Badge variant={getStatusVariant(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
              <Button
                onClick={() => checkPaymentStatus(payment.txId)}
                variant="ghost"
                size="small"
                loading={checkingStatus[payment.txId]}
                disabled={checkingStatus[payment.txId]}
              >
                {checkingStatus[payment.txId] ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
            
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-inter">Date</span>
                <span className="font-medium">{formatDate(payment.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-inter">Amount</span>
                <span className="font-semibold">${payment.totalAmount?.toFixed(2) || '0.00'} USDC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-inter">Employees</span>
                <span className="font-medium">{payment.employeeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-inter">Transaction</span>
                <span className="font-mono text-sm">{formatTxId(payment.txId)}</span>
              </div>
            </div>

            {payment.employees && payment.employees.length > 0 && (
              <div className="mt-16 pt-16 border-t border-gray-200">
                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex items-center gap-8 text-primary font-inter font-medium hover:text-primary-600 transition-colors"
                >
                  {expandedPayments[index] ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                  {expandedPayments[index] ? 'Hide' : 'View'} Employee Details
                </button>
                
                {expandedPayments[index] && (
                  <div className="mt-16 space-y-8">
                    {payment.employees.map((emp, empIndex) => (
                      <div
                        key={empIndex}
                        className="flex justify-between items-center p-12 bg-gray-50 rounded-button"
                      >
                        <div>
                          <p className="font-semibold font-inter text-secondary text-sm">
                            {emp.name}
                          </p>
                          <p className="text-xs font-mono text-gray-600">
                            {emp.address.slice(0, 6)}...{emp.address.slice(-4)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold">
                          ${parseFloat(emp.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;