import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAccount, useDisconnect } from "wagmi";
import { verifyMessage } from "ethers";

const AuthContext = createContext({
  isAuthenticated: false,
  userAddress: null,
  signIn: () => {},
  signOut: () => {},
  isLoading: false,
  error: null,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Check if user is already authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, [address]);

  // Monitor wagmi connection changes
  useEffect(() => {
    if (!isConnected) {
      setIsAuthenticated(false);
      localStorage.removeItem("base-auth");
    }
  }, [isConnected]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const savedAuth = localStorage.getItem("base-auth");
      if (savedAuth) {
        const { address: savedAddress, timestamp } = JSON.parse(savedAuth);

        // Check if auth is still valid (within 24 hours) and address matches
        if (
          Date.now() - timestamp < 24 * 60 * 60 * 1000 &&
          savedAddress === address &&
          isConnected
        ) {
          setIsAuthenticated(true);
          return;
        }
      }
      localStorage.removeItem("base-auth");
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("base-auth");
      setIsAuthenticated(false);
    }
  }, [address, isConnected]);

  const signIn = useCallback(
    async (signature, message) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!address || !isConnected) {
          throw new Error("Wallet not connected");
        }

        // Verify signature locally (for demo)
        const recoveredAddress = verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          throw new Error("Signature verification failed");
        }

        // Save auth state
        localStorage.setItem(
          "base-auth",
          JSON.stringify({
            address,
            timestamp: Date.now(),
          })
        );

        setIsAuthenticated(true);
        return true;
      } catch (err) {
        console.error("Sign in failed:", err);
        setError(err.message || "Authentication failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("base-auth");
    setIsAuthenticated(false);
    setError(null);
    disconnect();
  }, [disconnect]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userAddress: address,
        signIn,
        signOut,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
