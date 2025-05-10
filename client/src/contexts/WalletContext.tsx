import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type WalletProviderType = 'phantom';

export interface WalletUser {
  id: string;
  publicKey: string;
  email?: string;
  username?: string;
  name?: string;
  picture?: string;
  provider: 'wallet';
  is_profile_complete?: boolean;
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

  // Use ref to track connection state without triggering effect re-runs
  const isConnectingRef = React.useRef(false);
  isConnectingRef.current = isConnecting;

  // Use ref to track listener instance
  const listenerInstanceRef = React.useRef<number>(0);

  // Enhanced user state update function with explicit is_profile_complete handling
  const updateUser = React.useCallback((newUserData: Partial<WalletUser> | null) => {
    console.log('[WalletContext] updateUser called with:', {
      newUserData,
      currentUser: user,
      isProfileComplete: newUserData?.is_profile_complete,
      newUserDataString: JSON.stringify(newUserData, null, 2),
      timestamp: new Date().toISOString()
    });

    setUser(prevUser => {
      console.log('[WalletContext] setUser callback - previous state:', {
        prevUser,
        isProfileComplete: prevUser?.is_profile_complete,
        prevUserString: JSON.stringify(prevUser, null, 2),
        timestamp: new Date().toISOString()
      });

      if (newUserData === null) {
        console.log('[WalletContext] setUser callback - clearing user state');
        return null;
      }

      if (!prevUser) {
        if (!newUserData.id || !newUserData.publicKey) {
          console.error('[WalletContext] Cannot create new user without required fields:', newUserData);
          return null;
        }
        console.log('[WalletContext] setUser callback - no previous user, creating new user');
        const newUser: WalletUser = {
          id: newUserData.id,
          publicKey: newUserData.publicKey,
          provider: 'wallet' as const,
          is_profile_complete: newUserData.is_profile_complete ?? false,
          email: newUserData.email,
          username: newUserData.username,
          name: newUserData.name,
          picture: newUserData.picture
        };
        console.log('[WalletContext] setUser callback - new user created:', {
          newUser,
          isProfileComplete: newUser.is_profile_complete,
          newUserString: JSON.stringify(newUser, null, 2),
          timestamp: new Date().toISOString()
        });
        return newUser;
      }

      // For updates, ALWAYS use the new is_profile_complete value if provided
      const updatedUser: WalletUser = {
        ...prevUser,
        ...newUserData,
        provider: 'wallet' as const,
        // Explicitly set is_profile_complete to the new value if provided
        is_profile_complete: newUserData.is_profile_complete !== undefined 
          ? newUserData.is_profile_complete 
          : prevUser.is_profile_complete
      };

      // CRITICAL: Log the exact object being returned as new state
      console.log('[WalletContext] setUser callback - FINAL state update:', {
        updatedUser,
        isProfileComplete: updatedUser.is_profile_complete,
        updatedUserString: JSON.stringify(updatedUser, null, 2),
        wasProfileCompleteUpdated: newUserData.is_profile_complete !== undefined,
        timestamp: new Date().toISOString(),
        stack: new Error().stack // Log the call stack to see where this update originated
      });

      return updatedUser;
    });
  }, []); // Remove user dependency to prevent stale closures

  // Log user state changes with more detail
  useEffect(() => {
    console.log('[WalletContext] User state changed:', {
      hasUser: !!user,
      userId: user?.id,
      isProfileComplete: user?.is_profile_complete,
      userData: user,
      userStateString: JSON.stringify(user, null, 2),
      stack: new Error().stack,
      timestamp: new Date().toISOString()
    });
  }, [user]);

  // Check for any Supabase auth state changes - setup once on mount
  useEffect(() => {
    // Increment instance counter
    const instanceId = ++listenerInstanceRef.current;
    console.log(`[WalletContext] Setting up Supabase auth listener (instance ${instanceId})`);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // CRITICAL: Log the very first thing when callback is entered
      console.log(`[WalletContext] Instance ${instanceId}: Auth callback entered`, {
        event,
        isConnecting: isConnectingRef.current,
        timestamp: new Date().toISOString()
      });

      // CRITICAL: This must be the absolute first line in the callback
      // No async operations or promises before this check
      if (isConnectingRef.current) {
        console.log(`[WalletContext] Instance ${instanceId}: Active connection in progress, auth listener is passive, returning immediately`, {
          timestamp: new Date().toISOString()
        });
        return; // Early return - no further processing
      }

      // Wrap the rest of the callback in an async IIFE to ensure proper async handling
      (async () => {
        try {
          // Only proceed with any other logic if we're not connecting
          console.log(`[WalletContext] Instance ${instanceId}: Auth state changed:`, {
            event,
            hasSession: !!session,
            currentUser: user,
            isProfileComplete: user?.is_profile_complete,
            isConnecting: isConnectingRef.current,
            timestamp: new Date().toISOString()
          });

          if (event === 'SIGNED_OUT') {
            console.log(`[WalletContext] Instance ${instanceId}: User signed out, clearing state`);
            setUser(null);
            setWalletProvider(null);
          } else if (event === 'SIGNED_IN' && session?.user) {
            console.log(`[WalletContext] Instance ${instanceId}: User signed in, checking profile:`, {
              hasExistingUser: !!user,
              existingUserId: user?.id,
              sessionUserId: session.user.id,
              isProfileComplete: user?.is_profile_complete,
              currentUserState: JSON.stringify(user, null, 2)
            });

            // CRITICAL: If we have a user with is_profile_complete: true, DO NOT fetch from DB
            if (user?.is_profile_complete === true) {
              console.log(`[WalletContext] Instance ${instanceId}: User has is_profile_complete: true, preserving state`);
              return;
            }

            // Only proceed if we don't have a user or if the session user is different
            if (!user || user.id !== session.user.id) {
              console.log(`[WalletContext] Instance ${instanceId}: No matching user in context, fetching profile`);
              try {
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                if (error) {
                  console.error(`[WalletContext] Instance ${instanceId}: Error fetching profile:`, error);
                  return;
                }

                if (profile) {
                  console.log(`[WalletContext] Instance ${instanceId}: Found profile:`, {
                    profileId: profile.id,
                    isProfileComplete: profile.is_profile_complete,
                    existingUserState: JSON.stringify(user, null, 2)
                  });

                  // CRITICAL: Never overwrite is_profile_complete: true
                  if (user?.is_profile_complete === true) {
                    console.log(`[WalletContext] Instance ${instanceId}: Preserving is_profile_complete: true state`);
                    return;
                  }

                  // Only update if we don't have a user or if the profile data is different
                  if (!user || 
                      (user.id !== profile.id) || 
                      (user.is_profile_complete !== profile.is_profile_complete && !user.is_profile_complete)) {
                    console.log(`[WalletContext] Instance ${instanceId}: Updating user state with profile data`);
                    setUser({
                      id: profile.id,
                      publicKey: profile.auth_provider_id,
                      email: profile.email,
                      username: profile.display_name,
                      name: profile.display_name,
                      picture: profile.profile_picture_url,
                      provider: 'wallet',
                      is_profile_complete: profile.is_profile_complete
                    });
                  } else {
                    console.log(`[WalletContext] Instance ${instanceId}: Skipping profile update - preserving client state`);
                  }
                } else {
                  console.log(`[WalletContext] Instance ${instanceId}: No profile found for session user`);
                }
              } catch (error) {
                console.error(`[WalletContext] Instance ${instanceId}: Error in profile fetch:`, error);
              }
            } else {
              console.log(`[WalletContext] Instance ${instanceId}: User already exists in context with matching ID, skipping profile fetch`);
            }
          }
        } catch (error) {
          console.error(`[WalletContext] Instance ${instanceId}: Unexpected error in auth callback:`, error);
        }
      })();
    });

    return () => {
      console.log(`[WalletContext] Cleaning up Supabase auth listener (instance ${instanceId})`);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - setup once on mount

  const connect = async (walletType: WalletProviderType) => {
    console.log('[WalletContext] Starting connection process...');
    setIsConnecting(true);
    isConnectingRef.current = true; // Set ref immediately
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
      console.log('[WalletContext] BEFORE supabase.auth.signInWithPassword');
      let { data: { user: authUser, session }, error: authError } = await supabase.auth.signInWithPassword({
        email: `${publicKey.toLowerCase()}@wallet.local`,
        password: publicKey
      });
      console.log('[WalletContext] AFTER supabase.auth.signInWithPassword', { authUser, session, authError });

      // If sign in fails with invalid credentials, try to sign up
      if (authError?.message?.includes('Invalid login credentials')) {
        console.log('[WalletContext] Sign in failed, attempting sign up...');
        console.log('[WalletContext] BEFORE supabase.auth.signUp');
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
        console.log('[WalletContext] AFTER supabase.auth.signUp', { newUser, newSession, signUpError });

        if (signUpError) {
          console.error('[WalletContext] Sign up error:', signUpError);
          throw signUpError;
        }
        if (!newUser) {
          console.error('[WalletContext] No user data received after sign up');
          throw new Error('No user data received after sign up');
        }
        
        authUser = newUser;
        session = newSession;
        console.log('[WalletContext] New user created:', newUser.id);
      } else if (authError) {
        console.error('[WalletContext] Sign in error:', authError);
        throw authError;
      }

      if (!authUser) {
        console.error('[WalletContext] No user data received after authentication');
        throw new Error('No user data received after authentication');
      }

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
            public_key: publicKey
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
          provider: 'wallet',
          is_profile_complete: false
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
          provider: 'wallet',
          is_profile_complete: existingProfile.is_profile_complete
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
      console.log('[WalletContext] Connection process complete, cleaning up...');
      setIsConnecting(false);
      isConnectingRef.current = false; // Clear ref in finally
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

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => {
    // Create the value object with the current user state
    const valueToProvide = {
      user, // This is the current user state from useState
      setUser: updateUser,
      connect,
      disconnect,
      isConnecting,
      walletProvider,
      signTransaction,
      signAllTransactions,
      sendTransaction,
      // Add derived values for easier debugging
      hasUser: !!user,
      isProfileComplete: user?.is_profile_complete,
      userStateString: JSON.stringify(user, null, 2)
    };

    // CRITICAL: Log the exact state being used for the context value
    console.log('[WalletContext] Creating new context value:', {
      ...valueToProvide,
      userData: undefined, // Avoid logging full userData again since it's in userStateString
      timestamp: new Date().toISOString(),
      userState: {
        id: user?.id,
        isProfileComplete: user?.is_profile_complete,
        fullState: JSON.stringify(user, null, 2)
      }
    });

    return valueToProvide;
  }, [user, isConnecting, walletProvider]); // Only depend on state values, not functions

  // Log when the context value changes
  useEffect(() => {
    console.log('[WalletContext] Context value changed:', {
      hasUser: !!contextValue.user,
      isProfileComplete: contextValue.user?.is_profile_complete,
      isConnecting: contextValue.isConnecting,
      hasWalletProvider: !!contextValue.walletProvider,
      userStateString: JSON.stringify(contextValue.user, null, 2),
      timestamp: new Date().toISOString(),
      stack: new Error().stack // Add stack trace to see where this is triggered
    });
  }, [contextValue]);

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
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}