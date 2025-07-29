import React, { useState } from 'react';
import EmployeeModal from './EmployeeModal';
import PaymentPage from './PaymentPage';

const EmployeeList = ({ 
  employees, 
  onAddEmployee, 
  onRemoveEmployee, 
  onUpdateEmployee,
  onPaymentSuccess,
  userAddress 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleAddEmployee = (employee) => {
    onAddEmployee(employee);
    setShowModal(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    onUpdateEmployee(editingEmployee.id, updatedEmployee);
    setShowModal(false);
    setEditingEmployee(null);
  };

  const totalAmount = employees.reduce((sum, emp) => sum + parseFloat(emp.amount || 0), 0);

  return (
    <div>
      {/* Header with Add Employee and Pay All buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Employee Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)} USDC
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Add Employee
          </button>
          {employees.length > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Pay All (${totalAmount.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      {/* Employee List */}
      {employees.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No Employees Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add your first employee to get started with batch payroll
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Add Your First Employee
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{employee.name}</h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      ${parseFloat(employee.amount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">
                    {employee.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onRemoveEmployee(employee.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Modal */}
      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Payment Page */}
      {showPayment && (
        <PaymentPage
          employees={employees}
          onPaymentSuccess={onPaymentSuccess}
          onClose={() => setShowPayment(false)}
          userAddress={userAddress}
        />
      )}
    </div>
  );
};

export default EmployeeList;