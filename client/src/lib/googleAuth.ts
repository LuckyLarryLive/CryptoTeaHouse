import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

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
    // If no session, start the OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      logWithPersistence('[GoogleAuth] Supabase OAuth error:', error);
      throw error;
    }

    logWithPersistence('[GoogleAuth] OAuth flow initiated successfully');
    // The page will redirect to Google's consent screen
    return {
      id: '',
      email: '',
      name: '',
      picture: '',
    };
  } catch (error) {
    logWithPersistence('[GoogleAuth] Error in handleGoogleSignIn:', error);
    throw error;
  }
};

// Check if Google is initialized
export const isGoogleInitialized = () => {
  return typeof window.google !== 'undefined';
}; 