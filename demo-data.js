// Demo data for testing BatchPay
// This file contains sample employee data for demonstration purposes

export const demoEmployees = [
  {
    id: "1",
    name: "Alice Johnson",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    amount: "1500.00"
  },
  {
    id: "2", 
    name: "Bob Smith",
    address: "0x8ba1f109551bD432803012645Hac136c772c3c7c",
    amount: "2200.00"
  },
  {
    id: "3",
    name: "Carol Davis",
    address: "0x1234567890123456789012345678901234567890",
    amount: "1800.00"
  },
  {
    id: "4",
    name: "David Wilson",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    amount: "2500.00"
  },
  {
    id: "5",
    name: "Eva Brown",
    address: "0x9876543210987654321098765432109876543210",
    amount: "1950.00"
  }
];

export const demoPaymentHistory = [
  {
    txId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: Date.now() - 86400000, // 1 day ago
    status: "completed",
    employeeCount: 3,
    totalAmount: 5500.00,
    employees: [
      { name: "Alice Johnson", address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", amount: "1500.00" },
      { name: "Bob Smith", address: "0x8ba1f109551bD432803012645Hac136c772c3c7c", amount: "2200.00" },
      { name: "Carol Davis", address: "0x1234567890123456789012345678901234567890", amount: "1800.00" }
    ]
  },
  {
    txId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: Date.now() - 172800000, // 2 days ago
    status: "completed", 
    employeeCount: 2,
    totalAmount: 4450.00,
    employees: [
      { name: "David Wilson", address: "0xabcdef1234567890abcdef1234567890abcdef12", amount: "2500.00" },
      { name: "Eva Brown", address: "0x9876543210987654321098765432109876543210", amount: "1950.00" }
    ]
  }
];

// Function to load demo data into localStorage
export const loadDemoData = () => {
  localStorage.setItem('batchpay-employees', JSON.stringify(demoEmployees));
  localStorage.setItem('batchpay-history', JSON.stringify(demoPaymentHistory));
  console.log('Demo data loaded successfully!');
};

// Function to clear demo data
export const clearDemoData = () => {
  localStorage.removeItem('batchpay-employees');
  localStorage.removeItem('batchpay-history');
  console.log('Demo data cleared successfully!');
};

// Function to check if demo data exists
export const hasDemoData = () => {
  const employees = localStorage.getItem('batchpay-employees');
  const history = localStorage.getItem('batchpay-history');
  return employees && history;
};