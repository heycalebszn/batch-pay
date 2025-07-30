// src/components/PaymentPage.jsx
import React, { useState } from "react";
import { BasePayButton } from "@base-org/account-ui/react";
import { pay, getPaymentStatus } from "@base-org/account";
import { useAuth } from "../context/AuthContext";
import { SignInWithBase } from "./SignInWithBase";

const PaymentPage = ({ employees, onPaymentSuccess, onClose }) => {
  const { isAuthenticated, userAddress } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [error, setError] = useState("");
  const [activePayment, setActivePayment] = useState(null);

  const totalAmount = employees.reduce(
    (sum, emp) => sum + parseFloat(emp.amount || 0),
    0
  );

  const sendBatchPayment = async () => {
    if (!isAuthenticated || !userAddress) {
      setError("Please sign in with Base first");
      return;
    }

    console.log("💸 Starting payment process...");

    setIsProcessing(true);
    setPaymentStatus("preparing");
    setError("");

    try {
      console.log("🧾 Preparing to call pay() with:", {
        amount: totalAmount.toFixed(2),
        to: userAddress,
        testnet: true,
      });

      const payment = await pay({
        amount: totalAmount.toFixed(2),
        to: userAddress,
        testnet: true,
      });

      console.log("✅ pay() returned:", payment);

      setActivePayment(payment);
      setPaymentStatus("processing");

      // Poll for payment status
      const checkStatus = async () => {
        console.log("🔁 Checking payment status...");
        const status = await getPaymentStatus({
          id: payment.id,
          testnet: true,
        });

        console.log("📦 Payment status result:", status);

        if (status.status === "completed") {
          setPaymentStatus("success");
          onPaymentSuccess({
            txId: payment.id,
            timestamp: Date.now(),
            status: "completed",
            employeeCount: employees.length,
            totalAmount,
            employees: employees.map((emp) => ({
              name: emp.name,
              address: emp.address,
              amount: emp.amount,
            })),
          });

          setTimeout(() => onClose(), 2000);
        } else if (status.status === "failed") {
          setError("Payment failed");
          setPaymentStatus("error");
          setIsProcessing(false);
        } else {
          setTimeout(checkStatus, 2000);
        }
      };

      checkStatus();
    } catch (err) {
      console.error("❌ Payment failed:", err);
      setError(err.message || "Payment failed. Please try again.");
      setPaymentStatus("error");
      setIsProcessing(false);
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "preparing":
        return "Preparing payment...";
      case "processing":
        return "Processing payment...";
      case "success":
        return "Payment successful! 🎉";
      case "error":
        return "Payment failed. Please try again.";
      default:
        return "";
    }
  };

  // Show auth requirement if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in with Base to process payments.
          </p>

          <SignInWithBase />

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Process Payment</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-semibold">Total Payment</p>
              <p className="text-2xl">${totalAmount.toFixed(2)} USDC</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {employees.length} employees
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                From: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        {/* Employee List Preview */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Recipients</h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {employees.map((emp, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
              >
                <span className="font-medium">{emp.name}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ${parseFloat(emp.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {paymentStatus !== "idle" && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              paymentStatus === "success"
                ? "bg-green-100 dark:bg-green-900/20"
                : paymentStatus === "error"
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-blue-100 dark:bg-blue-900/20"
            }`}
          >
            <p
              className={
                paymentStatus === "success"
                  ? "text-green-800 dark:text-green-200"
                  : paymentStatus === "error"
                  ? "text-red-800 dark:text-red-200"
                  : "text-blue-800 dark:text-blue-200"
              }
            >
              {getStatusMessage()}
              {activePayment && (
                <span className="block text-xs mt-2">
                  TX: {activePayment.id.slice(0, 12)}...
                </span>
              )}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <BasePayButton
            onPay={() => {
              console.log("BasePay clicked!");
              sendBatchPayment();
            }}
            disabled={isProcessing || !isAuthenticated}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Pay with Base"}
          </BasePayButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
