import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import HistoryPage from './HistoryPage';
import Button from './ui/Button';
import { loadDemoData, clearDemoData, hasDemoData } from '../../demo-data.js';

const DashboardPage = ({ userAddress, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('batchpay-employees');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentHistory, setPaymentHistory] = useState(() => {
    const saved = localStorage.getItem('batchpay-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Save employees to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('batchpay-employees', JSON.stringify(employees));
  }, [employees]);

  // Save history to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('batchpay-history', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  const shortAddress = userAddress 
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : '';

  const addEmployee = (employee) => {
    setEmployees(prev => [...prev, { ...employee, id: Date.now().toString() }]);
  };

  const removeEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...updatedEmployee, id } : emp
    ));
  };

  const addPaymentToHistory = (payment) => {
    setPaymentHistory(prev => [payment, ...prev]);
  };

  const updatePaymentStatus = (txId, status) => {
    setPaymentHistory(prev => prev.map(payment => 
      payment.txId === txId ? { ...payment, status } : payment
    ));
  };

  const handleLoadDemoData = () => {
    loadDemoData();
    // Reload the data from localStorage
    const savedEmployees = localStorage.getItem('batchpay-employees');
    const savedHistory = localStorage.getItem('batchpay-history');
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedHistory) setPaymentHistory(JSON.parse(savedHistory));
  };

  const handleClearDemoData = () => {
    clearDemoData();
    setEmployees([]);
    setPaymentHistory([]);
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-24 py-16">
          <div className="flex items-center justify-between">
            {/* Logo + App name */}
            <div className="flex items-center space-x-16">
              <h1 className="text-2xl font-bold font-inter text-secondary">BatchPay</h1>
            </div>
            
            {/* User controls */}
            <div className="flex items-center space-x-16">
              <span className="text-body font-inter text-gray-600">
                {shortAddress}
              </span>
              {!hasDemoData() ? (
                <Button
                  onClick={handleLoadDemoData}
                  variant="secondary"
                  size="small"
                >
                  Load Demo Data
                </Button>
              ) : (
                <Button
                  onClick={handleClearDemoData}
                  variant="ghost"
                  size="small"
                >
                  Clear Demo Data
                </Button>
              )}
              <Button
                onClick={onDisconnect}
                variant="danger"
                size="small"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-24">
          <div className="flex">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-24 py-16 text-body font-inter font-semibold border-b-2 transition-all duration-200 ${
                activeTab === 'employees'
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-24 py-16 text-body font-inter font-semibold border-b-2 transition-all duration-200 ${
                activeTab === 'history'
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-24 py-32">
        {activeTab === 'employees' ? (
          <EmployeeList
            employees={employees}
            onAddEmployee={addEmployee}
            onRemoveEmployee={removeEmployee}
            onUpdateEmployee={updateEmployee}
            onPaymentSuccess={addPaymentToHistory}
            userAddress={userAddress}
          />
        ) : (
          <HistoryPage
            paymentHistory={paymentHistory}
            onUpdateStatus={updatePaymentStatus}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;