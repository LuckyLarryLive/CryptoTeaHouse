import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define the context types
interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  user: { id: number; publicKey: string } | null;
  connecting: boolean;
  isConnecting: boolean;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  sendTransaction: (transaction: Transaction) => Promise<string>;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  user: null,
  connecting: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  signTransaction: async () => new Transaction(),
  signAllTransactions: async () => [],
  sendTransaction: async () => "",
});

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [user, setUser] = useState<{ id: number; publicKey: string } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Solana RPC connection
  const connection = new Connection(
    import.meta.env.VITE_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // Check for available wallets on mount
  useEffect(() => {
    const checkWallet = async () => {
      // Check for Phantom wallet
      const solana = (window as any).solana;
      if (solana?.isPhantom) {
        setWallet(solana);
        
        // Check if already connected
        if (solana.isConnected) {
          const key = solana.publicKey.toString();
          setPublicKey(key);
          setConnected(true);
          
          try {
            await authenticateUser(key);
          } catch (error) {
            console.error("Failed to authenticate:", error);
          }
        }
      }
    };
    
    checkWallet();
  }, []);

  // Authenticate user with the server
  const authenticateUser = async (publicKeyStr: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth", { publicKey: publicKeyStr });
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  // Connect to wallet
  const connect = async (walletName: string) => {
    try {
      setIsConnecting(true);
      
      let walletToConnect;
      
      // Handle different wallet providers
      if (walletName === "phantom") {
        walletToConnect = (window as any).solana;
        if (!walletToConnect) {
          window.open("https://phantom.app/", "_blank");
          throw new Error("Phantom wallet not installed");
        }
      } else if (walletName === "solflare") {
        walletToConnect = (window as any).solflare;
        if (!walletToConnect) {
          window.open("https://solflare.com/", "_blank");
          throw new Error("Solflare wallet not installed");
        }
      } else {
        throw new Error("Unsupported wallet");
      }
      
      setWallet(walletToConnect);
      
      // Request connection to wallet
      const { publicKey } = await walletToConnect.connect();
      const publicKeyStr = publicKey.toString();
      
      setPublicKey(publicKeyStr);
      setConnected(true);
      
      // Authenticate with server
      await authenticateUser(publicKeyStr);
      
      toast({
        title: "Connected",
        description: "Wallet connected successfully!",
      });
      
      return;
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    if (wallet) {
      wallet.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
    setUser(null);
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
    });
  };

  // Sign transaction
  const signTransaction = async (transaction: Transaction): Promise<Transaction> => {
    if (!wallet || !connected) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signedTransaction = await wallet.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error("Failed to sign transaction:", error);
      throw error;
    }
  };

  // Sign all transactions
  const signAllTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
    if (!wallet || !connected) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signedTransactions = await wallet.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error("Failed to sign transactions:", error);
      throw error;
    }
  };

  // Send transaction
  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!wallet || !connected) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signature = await wallet.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        user,
        connecting,
        isConnecting,
        connect,
        disconnect,
        signTransaction,
        signAllTransactions,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
