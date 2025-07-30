import React, { useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";

export function SignInWithBase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Find the Base Account connector or fallback to injected
  const connector = connectors.find(
    (c) => c.id === "baseAccount" || c.id === "injected"
  );

  const handleSignIn = async () => {
    if (!connector) {
      setError("Base Account connector not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate or fetch nonce
      const nonce = window.crypto.randomUUID().replace(/-/g, "");

      // 2. Connect and get the provider
      const result = await connectAsync({ connector });
      const provider = await connector.getProvider();

      // 3. Request sign-in with Ethereum
      const authResult = await provider.request({
        method: "wallet_connect",
        params: [
          {
            version: "1",
            capabilities: {
              signInWithEthereum: {
                nonce,
                chainId: "0x2105", // Base Mainnet - 8453
              },
            },
          },
        ],
      });

      const { accounts } = authResult;
      const { address, capabilities } = accounts[0];
      const { message, signature } = capabilities.signInWithEthereum;

      // 4. Verify signature on your backend
      const response = await fetch("/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message, signature }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const authData = await response.json();
      console.log("Authentication successful:", authData);

      // Handle successful authentication (e.g., redirect, update state)
    } catch (err) {
      console.error("Sign in failed:", err);
      setError(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    disconnect();
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Connected as:</span>
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

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
