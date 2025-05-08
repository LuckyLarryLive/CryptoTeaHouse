import { supabase } from './supabase';

// Add Google OAuth types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              type: string;
              theme: string;
              size: string;
              text: string;
              shape: string;
              logo_alignment: string;
              width: number;
            }
          ) => void;
        };
      };
    };
  }
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'https://cryptoteahouse.com/auth/google/callback';

// Initialize Google OAuth
export const initGoogleAuth = () => {
  if (!window.google) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Add logging utility
const logWithPersistence = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    data: data ? JSON.stringify(data) : undefined
  };
  
  // Store in localStorage
  const existingLogs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('auth_logs', JSON.stringify(existingLogs));
  
  // Also log to console
  console.log(`[${timestamp}] ${message}`, data);
};

// Handle Google sign-in
export const handleGoogleSignIn = async (): Promise<GoogleUser> => {
  logWithPersistence('[GoogleAuth] Starting Google sign-in process...');
  
  try {
    // First check if we already have a session
    logWithPersistence('[GoogleAuth] Checking for existing session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      logWithPersistence('[GoogleAuth] Found existing session:', session.user);
      return {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata.full_name || session.user.email!,
        picture: session.user.user_metadata.avatar_url || '',
      };
    }

    logWithPersistence('[GoogleAuth] No existing session, initiating OAuth flow...');
    
    // Initialize Google OAuth client
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response) => {
        if (response.access_token) {
          try {
            // Get user info from Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${response.access_token}`
              }
            });
            const userInfo = await userInfoResponse.json();

            // Check if user already exists with this email
            const { data: existingUser, error: existingUserError } = await supabase
              .from('profiles')
              .select('id, email')
              .eq('email', userInfo.email)
              .single();

            if (existingUserError && existingUserError.code !== 'PGRST116') {
              throw existingUserError;
            }

            if (existingUser) {
              // User exists, sign them in
              const { data: { user, session }, error: signInError } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.access_token,
                nonce: 'nonce',
              });

              if (signInError) throw signInError;
              if (!user) throw new Error('No user data received after sign in');

              return {
                id: user.id,
                email: user.email!,
                name: user.user_metadata.full_name || user.email!,
                picture: user.user_metadata.avatar_url || '',
              };
            }

            // New user, sign up
            const { data: { user, session }, error: signUpError } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.access_token,
              nonce: 'nonce',
            });

            if (signUpError) throw signUpError;
            if (!user) throw new Error('No user data received after sign up');

            // Create initial profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                display_name: user.user_metadata.full_name || user.email,
                profile_picture: user.user_metadata.avatar_url,
                auth_provider: 'google',
                auth_provider_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (profileError) throw profileError;

            // Store the token
            localStorage.setItem('auth_token', session?.access_token || '');

            return {
              id: user.id,
              email: user.email!,
              name: user.user_metadata.full_name || user.email!,
              picture: user.user_metadata.avatar_url || '',
            };
          } catch (error) {
            logWithPersistence('[GoogleAuth] Error in callback:', error);
            throw error;
          }
        }
      }
    });

    // Request access token
    client.requestAccessToken();
    
    // Return empty user object as we'll get the real one in the callback
    return {
      id: '',
      email: '',
      name: '',
      picture: ''
    };
  } catch (error) {
    logWithPersistence('[GoogleAuth] Error in handleGoogleSignIn:', error);
    throw error;
  }
};

export const isGoogleInitialized = () => {
  return typeof window.google !== 'undefined';
};

export const isGoogleAvailable = (): boolean => {
  return typeof window.google !== 'undefined';
};

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    throw error;
  }

  return data;
} 