import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('[AuthCallback] Starting auth callback handling...');
      setLoading(true);
      
      try {
        // Get the session
        console.log('[AuthCallback] Fetching session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[AuthCallback] Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.error('[AuthCallback] No session found');
          throw new Error('No session found');
        }

        console.log('[AuthCallback] Session found:', session);

        // Get the user
        console.log('[AuthCallback] Fetching user data...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('[AuthCallback] User error:', userError);
          throw userError;
        }

        if (!user) {
          console.error('[AuthCallback] No user found in session');
          throw new Error('No user found in session');
        }

        console.log('[AuthCallback] User data retrieved:', user);

        // Check if user has completed their profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error('Profile check error:', profileError);
          throw profileError;
        }

        // If no profile exists, redirect to profile completion
        if (!profile) {
          console.log('[AuthCallback] No profile found, redirecting to complete-profile');
          setLocation('/complete-profile');
        } else {
          console.log('[AuthCallback] Profile found, redirecting to dashboard');
          setLocation('/dashboard');
        }
      } catch (error) {
        console.error('[AuthCallback] Error handling auth callback:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        // Redirect to login after a short delay
        console.log('[AuthCallback] Will redirect to login in 3 seconds...');
        setTimeout(() => {
          console.log('[AuthCallback] Redirecting to login...');
          setLocation('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-light-300 mb-2">Authentication Error</p>
          <p className="text-light-400 text-sm">{error}</p>
          <p className="text-light-400 text-sm mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-light-300">Completing sign in...</p>
        {loading && <p className="text-light-400 text-sm mt-2">Please wait while we process your authentication...</p>}
      </div>
    </div>
  );
} 