import React, { useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { useAuth } from "../context/AuthContext";

export function SignInWithBase() {
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const {
    isAuthenticated,
    signIn,
    signOut,
    isLoading: authLoading,
    error: authError,
  } = useAuth();

  // Find the Base Account connector
  const connector = connectors.find((c) => c.id === "baseAccount");

  const handleSignIn = async () => {
    if (!connector) {
      setLocalError("Base Account connector not found");
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    // Inside handleSignIn
    try {
      if (!isConnected) {
        await connectAsync({ connector });
      }

      const provider = await connector.getProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      const currentAddress = accounts?.[0];

      if (!currentAddress)
        throw new Error("No wallet address found from provider");

      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Please sign this message to authenticate with BatchPay.\nNonce: ${nonce}\nAddress: ${currentAddress}`;

      const signature = await provider.request({
        method: "personal_sign",
        params: [message, currentAddress],
      });

      const success = await signIn(signature, message);
      if (!success) throw new Error("Authentication failed");
    } catch (err) {
      if (err.code === 4001) {
        setLocalError("Signature request was rejected by the user.");
      } else if (err.name === "ConnectorAlreadyConnectedError") {
        setLocalError("You're already connected.");
      } else {
        console.error("Sign in failed:", err);
        setLocalError(err.message || "Sign in failed.");
      }
    }
    setLocalLoading(false);
  };
  if (isConnected && isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Connected as:</span>
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <span className="text-xs text-green-600 mt-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Signed In
          </span>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const isLoading = localLoading || authLoading;
  const error = localError || authError;

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        disabled={isLoading || !connector}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in with Base"}
      </button>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
