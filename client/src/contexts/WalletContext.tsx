import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Define the context types
interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  user: { 
    id: number; 
    publicKey: string; 
    username?: string;
    email?: string;
    name?: string;
    picture?: string;
    provider?: 'wallet' | 'google' | 'email';
  } | null;
  connecting: boolean;
  isConnecting: boolean;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  sendTransaction: (transaction: Transaction) => Promise<string>;
  setUser: (user: WalletContextType['user']) => void;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  user: null,
  connecting: false,
  isConnecting: false,
  connect: async () => { throw new Error("Default context connect function was called"); },
  disconnect: () => { console.error("[WalletContext] DEFAULT disconnect called."); },
  signTransaction: async () => { throw new Error("Default signTransaction called."); },
  signAllTransactions: async () => { throw new Error("Default signAllTransactions called."); },
  sendTransaction: async () => { throw new Error("Default sendTransaction called."); },
  setUser: () => { console.error("[WalletContext] DEFAULT setUser called."); },
});

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

interface WalletContextProviderProps {
  children: ReactNode;
}

// Add this type for temporary wallet data
interface TempWalletData {
  publicKey: string;
  timestamp: number;
}

export function WalletProvider({ children }: WalletContextProviderProps) {
  const [, setLocation] = useLocation();
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [user, setUser] = useState<WalletContextType['user']>(null);
  const [connecting, setConnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check for Supabase session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: parseInt(session.user.id),
          publicKey: session.user.email || '',
          email: session.user.email,
          name: session.user.user_metadata.full_name,
          picture: session.user.user_metadata.avatar_url,
          provider: 'google'
        });
        setConnected(true);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: parseInt(session.user.id),
          publicKey: session.user.email || '',
          email: session.user.email,
          name: session.user.user_metadata.full_name,
          picture: session.user.user_metadata.avatar_url,
          provider: 'google'
        });
        setConnected(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setConnected(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      // First check if a user exists with this wallet address
      const { data: existingUser, error: existingUserError } = await supabase
        .from('profiles')
        .select('id, auth_provider_id, is_profile_complete')
        .eq('auth_provider_id', publicKeyStr)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        throw existingUserError;
      }

      if (!existingUser) {
        // Store temporary wallet data in localStorage
        const tempWalletData: TempWalletData = {
          publicKey: publicKeyStr,
          timestamp: Date.now()
        };
        localStorage.setItem('tempWalletData', JSON.stringify(tempWalletData));

        // Set temporary connection state
        setPublicKey(publicKeyStr);
        setConnected(true);
        setUser({
          id: 0, // Temporary ID
          publicKey: publicKeyStr,
          provider: 'wallet'
        });

        // Redirect to complete profile page for new users
        setLocation('/complete-profile');
        return;
      } else {
        // Existing user found
        if (!existingUser.is_profile_complete) {
          // Profile incomplete - treat as new registration
          const tempWalletData: TempWalletData = {
            publicKey: publicKeyStr,
            timestamp: Date.now()
          };
          localStorage.setItem('tempWalletData', JSON.stringify(tempWalletData));
          
          setPublicKey(publicKeyStr);
          setConnected(true);
          setUser({
            id: existingUser.id,
            publicKey: publicKeyStr,
            provider: 'wallet'
          });

          setLocation('/complete-profile');
          return;
        }

        // Profile complete - normal sign in
        setUser({
          id: existingUser.id,
          publicKey: publicKeyStr,
          provider: 'wallet'
        });

        setPublicKey(publicKeyStr);
        setConnected(true);

        // Redirect to dashboard for existing users
        setLocation('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  // Clean up temporary wallet data on unmount
  useEffect(() => {
    return () => {
      const tempWalletData = localStorage.getItem('tempWalletData');
      if (tempWalletData) {
        const data = JSON.parse(tempWalletData);
        // Clean up if older than 1 hour
        if (Date.now() - data.timestamp > 3600000) {
          localStorage.removeItem('tempWalletData');
        }
      }
    };
  }, []);

  // Connect to wallet
  const connect = async (walletName: string) => {
    console.log(`[WalletContext] connect function called with: ${walletName}`);
    try {
      setIsConnecting(true);
      console.log(`[WalletContext] setIsConnecting(true)`);
      
      let walletToConnect;
      
      // Handle different wallet providers
      if (walletName === "phantom") {
        console.log("[WalletContext] Processing 'phantom' wallet...");
        const phantom = (window as any).solana;
        console.log("[WalletContext] Phantom provider object:", phantom);
        console.log("[WalletContext] Phantom wallet check:", { 
          exists: !!phantom, 
          isPhantom: phantom?.isPhantom,
          isConnected: phantom?.isConnected 
        });
        
        if (!phantom) {
          console.error("[WalletContext] Phantom provider (window.solana) not found.");
          toast({
            title: "Phantom Not Found",
            description: "Please install the Phantom wallet extension first.",
            variant: "destructive",
          });
          window.open("https://phantom.app/", "_blank");
          throw new Error("Phantom wallet not installed. Please install it first.");
        }
        
        if (!phantom.isPhantom) {
          console.error("[WalletContext] window.solana is not Phantom. isPhantom flag is missing or false.");
          toast({
            title: "Invalid Wallet",
            description: "Please make sure you have the official Phantom wallet installed.",
            variant: "destructive",
          });
          throw new Error("Invalid Phantom wallet detected. Please install the official Phantom wallet.");
        }
        
        walletToConnect = phantom;
        console.log("[WalletContext] Assigned phantom to walletToConnect.");
      } else if (walletName === "solflare") {
        console.log("[WalletContext] Processing 'solflare' wallet...");
        const solflare = (window as any).solflare;
        console.log("[WalletContext] Solflare provider object:", solflare);
        if (!solflare) {
          console.error("[WalletContext] Solflare provider (window.solflare) not found.");
          window.open("https://solflare.com/", "_blank");
          throw new Error("Solflare wallet not installed. Please install it first.");
        }
        walletToConnect = solflare;
        console.log("[WalletContext] Assigned solflare to walletToConnect.");
      } else {
        console.error(`[WalletContext] Unsupported wallet: ${walletName}`);
        throw new Error("Unsupported wallet");
      }
      
      setWallet(walletToConnect);
      console.log(`[WalletContext] Wallet provider set for ${walletName}`);
      
      try {
        console.log(`[WalletContext] Attempting walletToConnect.connect() for ${walletName}...`);
        const resp = await walletToConnect.connect();
        console.log(`[WalletContext] walletToConnect.connect() response for ${walletName}:`, resp);
        
        if (!resp || !resp.publicKey) {
          console.error(`[WalletContext] Connection to ${walletName} failed or publicKey missing in response. Response:`, resp);
          throw new Error(`Connection to ${walletName} failed or publicKey missing.`);
        }

        const publicKeyStr = resp.publicKey.toString();
        console.log(`[WalletContext] Connected with public key: ${publicKeyStr}`);
        
        setPublicKey(publicKeyStr);
        setConnected(true);
        
        console.log("[WalletContext] Attempting server authentication...");
        await authenticateUser(publicKeyStr);
        console.log("[WalletContext] Server authentication successful.");
        
        toast({
          title: "Connected",
          description: "Wallet connected successfully!",
        });
      } catch (err) {
        console.error(`[WalletContext] Error during walletToConnect.connect() or post-connection for ${walletName}:`, err);
        if (err instanceof Error && !err.message?.includes("User rejected")) {
          toast({
            title: "Connection Failed",
            description: err.message || `Failed to connect to ${walletName}. Please try again.`,
            variant: "destructive",
          });
        }
        throw err;
      }
      
      console.log(`[WalletContext] connect function for ${walletName} finishing successfully.`);
      return;
    } catch (error: any) {
      console.error(`[WalletContext] Outer catch block error for ${walletName}:`, error);
      if (!error.message?.includes("User rejected") && 
          !error.message?.includes("not installed") && 
          !error.message?.includes("Invalid Phantom wallet")) {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect to wallet",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsConnecting(false);
      console.log(`[WalletContext] setIsConnecting(false) in finally block for ${walletName}`);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    if (user?.provider === 'google') {
      await supabase.auth.signOut();
    } else if (wallet) {
      wallet.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
    setUser(null);
    toast({
      title: "Disconnected",
      description: "Successfully disconnected",
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

  const contextValue = {
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
    setUser,
  };

  // Log the connect function being provided to the context
  console.log("[WalletContext] PROVIDING context value. Connect function reference:", contextValue.connect);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}