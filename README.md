# BatchPay - One-Click Batch USDC Payroll on Base

A modern, user-friendly DApp for batch USDC payroll payments on Base mainnet, built exclusively with the Base SDK.

## 🚀 Features

- **One-Click Batch Payments**: Pay multiple employees with a single transaction
- **Base SDK Integration**: Built exclusively with `@base-org/account` & `@base-org/account-ui`
- **Dark/Light Mode**: Beautiful, accessible UI with theme switching
- **Employee Management**: Add, edit, and remove employees dynamically
- **Payment History**: Track all batch payments with status updates
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Gas Optimization**: Uses atomic batch transactions when supported
- **Fallback Support**: Gracefully handles wallets without batching support

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Wallet Integration**: Base SDK (`@base-org/account`, `@base-org/account-ui`)
- **Blockchain**: Base mainnet
- **Token**: USDC on Base
- **Storage**: localStorage (no backend required)
- **Deployment**: Vercel-ready

## 📋 Requirements

- Node.js 18+ 
- npm or yarn
- Base wallet (Coinbase Wallet, Base Wallet, etc.)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd batch-pay
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173` and connect your Base wallet.

## 🎯 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" on the landing page
- Approve the connection in your Base wallet

### 2. Add Employees
- Click "Add Employee" in the dashboard
- Enter employee name, wallet address, and USDC amount
- Save employee details

### 3. Batch Payment
- Review the employee list and total amount
- Click "Pay All" to initiate batch payment
- Approve the transaction in your wallet
- Monitor payment status in the History tab

### 4. Track Payments
- View payment history with transaction IDs
- Check payment status for each batch
- See detailed employee breakdowns

## 🔧 Core Implementation

### Batch Transaction Logic

```javascript
// Check wallet capabilities
const capabilities = await provider.request({
  method: 'wallet_getCapabilities',
  params: [userAddress]
});

const atomicSupported = capabilities[base.constants.CHAIN_IDS.base]?.atomicBatch?.supported || false;

// Prepare USDC transfer calls
const calls = employees.map(employee => ({
  to: USDC_ADDRESS,
  value: '0x0',
  data: encodeFunctionData(ERC20_ABI, 'transfer', [
    employee.address, 
    parseUnits(employee.amount, 6)
  ])
}));

// Send batch transaction
const params = [{
  version: '2.0.0',
  from: userAddress,
  chainId: base.constants.CHAIN_IDS.base,
  atomicRequired: atomicSupported,
  calls: calls
}];

const txId = await provider.request({
  method: 'wallet_sendCalls',
  params: params
});
```

### Key Components

- **LandingPage**: Hero section with wallet connection
- **DashboardPage**: Main interface with tabs and state management
- **EmployeeList**: Employee management with add/edit/remove
- **EmployeeModal**: Form validation for employee data
- **PaymentPage**: Batch payment execution with status tracking
- **HistoryPage**: Payment history with status checking

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Automatic theme switching
- **Loading States**: Smooth animations and feedback
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant with focus management
- **Animations**: Subtle hover effects and transitions

## 🔒 Security

- **Client-Side Only**: No backend required, data stored locally
- **Address Validation**: Ethereum address format verification
- **Amount Validation**: Positive number validation with limits
- **Transaction Safety**: Proper error handling and status tracking

## 📱 Mobile Support

- **Touch-Friendly**: Large buttons and touch targets
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Navigation**: Optimized for thumb navigation
- **Progressive Web App**: Installable on mobile devices

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on main branch
4. Configure custom domain (optional)

### Environment Variables

No environment variables required - the app works entirely client-side.

## 📊 Performance

- **Bundle Size**: Optimized with Vite
- **Loading Speed**: Fast initial load with code splitting
- **Runtime Performance**: Efficient React rendering
- **Memory Usage**: Minimal memory footprint

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure you're using a Base-compatible wallet
   - Check if wallet is connected to Base mainnet

2. **Payment Fails**
   - Verify sufficient USDC balance
   - Check gas fees and network congestion
   - Ensure wallet supports batch transactions

3. **Employee Data Lost**
   - Data is stored in localStorage
   - Clear browser data will reset employees
   - Consider backing up employee data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Base team for the excellent SDK
- Vercel for hosting
- Tailwind CSS for styling
- React team for the amazing framework

---

**Built with ❤️ for the Base ecosystem**
