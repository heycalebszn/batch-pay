import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import HistoryPage from './HistoryPage';
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">BatchPay Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome, {shortAddress}
            </p>
          </div>
          <div className="flex gap-2">
            {!hasDemoData() ? (
              <button
                onClick={handleLoadDemoData}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                Load Demo Data
              </button>
            ) : (
              <button
                onClick={handleClearDemoData}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                Clear Demo Data
              </button>
            )}
            <button
              onClick={onDisconnect}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors duration-200 ${
              activeTab === 'employees'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors duration-200 ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
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
    </div>
  );
};

export default DashboardPage;