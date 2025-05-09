import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type WalletProviderType = 'phantom';

interface WalletUser {
  id: string;
  publicKey: string;
  email?: string;
  username?: string;
  name?: string;
  picture?: string;
  provider: 'wallet';
}

interface PhantomWallet {
  isPhantom: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (transaction: Transaction) => Promise<string>;
}

interface WalletContextType {
  user: WalletUser | null;
  setUser: (user: WalletUser | null) => void;
  connect: (walletType: WalletProviderType) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  walletProvider: PhantomWallet | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  sendTransaction: (transaction: Transaction) => Promise<string>;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  user: null,
  setUser: () => {},
  connect: async () => { throw new Error("Default context connect function was called"); },
  disconnect: async () => { throw new Error("Default context disconnect function was called"); },
  isConnecting: false,
  walletProvider: null,
  signTransaction: async () => { throw new Error("Default signTransaction called."); },
  signAllTransactions: async () => { throw new Error("Default signAllTransactions called."); },
  sendTransaction: async () => { throw new Error("Default sendTransaction called."); }
});

// Hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletContextProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletContextProviderProps) {
  const [, setLocation] = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<WalletUser | null>(null);
  const [walletProvider, setWalletProvider] = useState<PhantomWallet | null>(null);
  const { toast } = useToast();

  const connect = async (walletType: WalletProviderType) => {
    setIsConnecting(true);
    try {
      let walletToConnect: PhantomWallet;

      if (walletType === 'phantom') {
        const solana = (window as any).solana as PhantomWallet;
        if (!solana?.isPhantom) {
          throw new Error('Phantom wallet not found');
        }
        walletToConnect = solana;
        setWalletProvider(solana);
      } else {
        throw new Error('Unsupported wallet type');
      }

      const response = await walletToConnect.connect();
      const publicKey = response.publicKey.toString();

      console.log('[WalletContext] Starting wallet connection process...', { publicKey });

      // Try to sign in first
      let { data: { user: authUser, session }, error: authError } = await supabase.auth.signInWithPassword({
        email: `${publicKey.toLowerCase()}@wallet.local`,
        password: publicKey
      });

      // If sign in fails with invalid credentials, try to sign up
      if (authError?.message?.includes('Invalid login credentials')) {
        console.log('[WalletContext] Sign in failed, attempting sign up...');
        const { data: { user: newUser, session: newSession }, error: signUpError } = await supabase.auth.signUp({
          email: `${publicKey.toLowerCase()}@wallet.local`,
          password: publicKey,
          options: {
            data: {
              public_key: publicKey,
              provider: 'wallet'
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!newUser) throw new Error('No user data received after sign up');
        
        authUser = newUser;
        session = newSession;
        console.log('[WalletContext] New user created:', newUser.id);
      } else if (authError) {
        throw authError;
      }

      if (!authUser) throw new Error('No user data received after authentication');

      // Create initial user record if it doesn't exist
      console.log('[WalletContext] Checking for existing user record...');
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('[WalletContext] Error checking user record:', userError);
        throw userError;
      }

      // Create user record if it doesn't exist
      if (!existingUser) {
        console.log('[WalletContext] Creating initial user record...');
        const { data: newUser, error: createUserError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            public_key: publicKey,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createUserError) {
          console.error('[WalletContext] Error creating user record:', createUserError);
          throw createUserError;
        }
        console.log('[WalletContext] Initial user record created successfully');
      } else {
        console.log('[WalletContext] Existing user record found');
      }

      // Wait for the user record to be available
      console.log('[WalletContext] Verifying user record is accessible...');
      let retries = 0;
      let userRecord = null;
      while (retries < 3) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!error && data) {
          userRecord = data;
          break;
        }

        console.log(`[WalletContext] Retry ${retries + 1} to fetch user record...`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        retries++;
      }

      if (!userRecord) {
        throw new Error('Failed to verify user record after creation');
      }

      // Check if profile exists
      console.log('[WalletContext] Checking for existing profile...');
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('[WalletContext] Error checking profile:', profileError);
        throw profileError;
      }

      // Create profile if it doesn't exist
      if (!existingProfile) {
        console.log('[WalletContext] Creating initial profile...');
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            auth_provider_id: publicKey,
            display_name: '',
            handle: `user_${authUser.id.slice(0, 8)}`,
            is_profile_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createProfileError) {
          console.error('[WalletContext] Error creating profile:', createProfileError);
          throw createProfileError;
        }
        console.log('[WalletContext] Initial profile created successfully');

        // Store temporary wallet data
        localStorage.setItem('tempWalletData', JSON.stringify({
          publicKey: publicKey,
          provider: 'wallet',
          timestamp: Date.now()
        }));
        
        // Set temporary user state
        setUser({
          id: authUser.id,
          publicKey: publicKey,
          provider: 'wallet'
        });
        
        setLocation('/complete-profile');
      } else {
        console.log('[WalletContext] Existing profile found');
        // Profile exists, set the user data
        setUser({
          id: existingProfile.id,
          publicKey: publicKey,
          email: existingProfile.email,
          username: existingProfile.display_name,
          name: existingProfile.display_name,
          picture: existingProfile.profile_picture_url,
          provider: 'wallet'
        });

        if (!existingProfile.is_profile_complete) {
          localStorage.setItem('tempWalletData', JSON.stringify({
            publicKey: publicKey,
            provider: 'wallet',
            timestamp: Date.now()
          }));
          setLocation('/complete-profile');
        } else {
          setLocation('/dashboard');
        }
      }

      console.log('[WalletContext] Wallet connection process completed successfully');
      toast({
        title: "Connected",
        description: "Wallet connected successfully!",
      });
    } catch (error) {
      console.error('[WalletContext] Error during wallet connection:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (walletProvider) {
      await walletProvider.disconnect();
    }
    setWalletProvider(null);
    setUser(null);
    toast({
      title: "Disconnected",
      description: "Wallet disconnected successfully",
    });
  };

  const signTransaction = async (transaction: Transaction): Promise<Transaction> => {
    if (!walletProvider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signedTransaction = await walletProvider.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      throw error;
    }
  };

  const signAllTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
    if (!walletProvider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signedTransactions = await walletProvider.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      throw error;
    }
  };

  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!walletProvider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const signature = await walletProvider.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      throw error;
    }
  };

  // Clean up temporary wallet data on unmount
  useEffect(() => {
    return () => {
      const tempWalletData = localStorage.getItem('tempWalletData');
      if (tempWalletData) {
        const data = JSON.parse(tempWalletData);
        if (Date.now() - data.timestamp > 3600000) {
          localStorage.removeItem('tempWalletData');
        }
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ 
      user, 
      setUser, 
      connect, 
      disconnect,
      isConnecting,
      walletProvider,
      signTransaction,
      signAllTransactions,
      sendTransaction
    }}>
      {children}
    </WalletContext.Provider>
  );
}