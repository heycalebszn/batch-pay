import React, { useState } from 'react';
import { User, Edit, Trash2, Users } from 'lucide-react';
import EmployeeModal from './EmployeeModal';
import PaymentPage from './PaymentPage';
import Button from './ui/Button';
import { Card } from './ui/Card';

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

  // Generate avatar initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {/* Header with Add Employee and Pay All buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-24 mb-32">
        <div>
          <h2 className="text-2xl font-bold font-inter text-secondary mb-8">
            Employee Management
          </h2>
          <p className="text-body font-inter text-gray-600">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)} USDC
          </p>
        </div>
        <div className="flex gap-16">
          <Button
            onClick={() => setShowModal(true)}
            variant="secondary"
            size="medium"
          >
            Add Employee
          </Button>
          {employees.length > 0 && (
            <Button
              onClick={() => setShowPayment(true)}
              variant="primary"
              size="medium"
            >
              Pay All (${totalAmount.toFixed(2)})
            </Button>
          )}
        </div>
      </div>

      {/* Employee List */}
      {employees.length === 0 ? (
        <Card className="text-center py-48">
          <div className="flex justify-center mb-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-inter text-secondary mb-16">
            No Employees Yet
          </h3>
          <p className="text-body font-inter text-gray-600 mb-32 max-w-md mx-auto">
            Add your first employee to get started with batch payroll
          </p>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="large"
          >
            Add Your First Employee
          </Button>
        </Card>
      ) : (
        <div className="grid gap-16">
          {employees.map((employee) => (
            <Card
              key={employee.id}
              hover
              className="p-24 group cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-24 flex-1">
                  {/* Avatar */}
                  <div className="w-48 h-48 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary font-inter font-semibold text-lg">
                      {getInitials(employee.name)}
                    </span>
                  </div>
                  
                  {/* Employee Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-16 mb-8">
                      <h3 className="text-lg font-bold font-inter text-secondary">
                        {employee.name}
                      </h3>
                      <span className="bg-accent-100 text-accent-700 text-sm font-medium font-inter px-8 py-4 rounded-button">
                        ${parseFloat(employee.amount).toFixed(2)} USDC
                      </span>
                    </div>
                    <p className="text-body font-inter text-gray-600 font-mono">
                      {employee.address}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEmployee(employee);
                    }}
                    className="p-8 text-gray-400 hover:text-primary transition-colors rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Edit employee"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEmployee(employee.id);
                    }}
                    className="p-8 text-gray-400 hover:text-red-600 transition-colors rounded-button focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
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