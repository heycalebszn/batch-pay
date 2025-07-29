import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

const EmployeeModal = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        address: employee.address || '',
        amount: employee.amount || ''
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.address.trim())) {
      newErrors.address = 'Please enter a valid Ethereum address (0x...)';
    }

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount cannot exceed 1,000,000 USDC';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        name: formData.name.trim(),
        address: formData.address.trim(),
        amount: parseFloat(formData.amount).toFixed(2)
      });
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add Employee'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-24">
        {/* Name Field */}
        <Input
          label="Employee Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          placeholder="Enter employee name"
          disabled={isSubmitting}
        />

        {/* Address Field */}
        <Input
          label="Wallet Address"
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={errors.address}
          required
          placeholder="0x..."
          className="font-mono"
          disabled={isSubmitting}
        />

        {/* Amount Field */}
        <Input
          label="USDC Amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          error={errors.amount}
          required
          placeholder="0.00"
          suffix="USDC"
          disabled={isSubmitting}
        />

        {/* Action Buttons */}
        <div className="flex gap-16 pt-16">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="medium"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            className="flex-1"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;