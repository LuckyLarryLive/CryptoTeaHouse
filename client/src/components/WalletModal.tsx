import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "wouter";
import { initGoogleAuth, handleGoogleSignIn, isGoogleInitialized } from "@/lib/googleAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUp?: boolean;
}

export default function WalletModal({ isOpen, onClose, isSignUp = false }: WalletModalProps) {
  const { connect, isConnecting, setUser } = useWallet();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Initialize Google Auth when modal opens
  useEffect(() => {
    if (isOpen) {
      initGoogleAuth();
    }
  }, [isOpen]);

  const handleConnect = async (walletName: string) => {
    console.log(`[WalletModal] handleConnect called with: ${walletName}`);
    setSelectedWallet(walletName);
    try {
      console.log(`[WalletModal] Attempting to call context.connect for ${walletName}...`);
      await connect(walletName);
      console.log(`[WalletModal] context.connect for ${walletName} completed.`);
      onClose();
    } catch (error) {
      console.error(`[WalletModal] Error calling context.connect for ${walletName}:`, error);
      if (error instanceof Error && 
          (error.message.includes("User rejected") || 
           error.message.includes("timeout") ||
           error.message.includes("Internal server error"))) {
        setSelectedWallet(null);
      }
    }
  };

  const validateForm = async () => {
    const errors: typeof formErrors = {};

    // Validate username
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else {
      // Check if username is unique
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', username)
        .single();

      if (existingUser) {
        errors.username = 'This username is already taken';
      }
    }

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    } else {
      // Check if email is unique
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingEmail) {
        errors.email = 'This email is already registered';
      }
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Validate confirm password
    if (isSignUp && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUsernamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        // Sign up with email/password
        const { data: { user, session }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!user) throw new Error('No user data received after sign up');

        // Create initial profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: email,
            display_name: username,
            auth_provider: 'email',
            auth_provider_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to verify your account.",
        });

        onClose();
        window.location.href = '/complete-profile';
      } else {
        // Sign in with email/password
        const { data: { user, session }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (!user) throw new Error('No user data received after sign in');

        setUser({
          id: parseInt(user.id),
          publicKey: user.email || '',
          email: user.email,
          name: user.user_metadata.username || user.email,
          provider: 'email'
        });

        toast({
          title: "Success",
          description: "Successfully signed in",
        });

        onClose();
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error(isSignUp ? "Sign up error:" : "Sign in error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    if (provider === "gmail") {
      setIsGoogleLoading(true);
      try {
        if (!isGoogleInitialized()) {
          throw new Error("Google authentication not initialized");
        }
        const user = await handleGoogleSignIn();
        if (user) {
          setUser({
            id: parseInt(user.id),
            publicKey: user.email, // Using email as publicKey for Google users
            email: user.email,
            name: user.name,
            picture: user.picture,
            provider: 'google'
          });

          // Check if user has completed their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          // If no profile exists, redirect to profile completion
          if (!profile) {
            onClose();
            window.location.href = '/complete-profile';
          } else {
            onClose();
            window.location.href = '/dashboard';
          }

          toast({
            title: "Success",
            description: "Successfully signed in with Google",
          });
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
        toast({
          title: "Error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        });
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      // TODO: Implement other social sign-in methods
      console.log(`Sign in with ${provider}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="bg-dark-800/95 backdrop-blur-md border border-dark-700 text-white w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isSignUp ? "Create Account" : "Sign In"}
            </DialogTitle>
            <DialogDescription className="text-light-300">
              Choose your preferred {isSignUp ? "sign up" : "sign in"} method
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Username/Password Form */}
            <form onSubmit={handleUsernamePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`bg-dark-700 border-dark-600 text-white ${formErrors.username ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.username && (
                  <p className="text-sm text-red-500">{formErrors.username}</p>
                )}
                
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-dark-700 border-dark-600 text-white ${formErrors.email ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-dark-700 border-dark-600 text-white ${formErrors.password ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}

                {isSignUp && (
                  <>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`bg-dark-700 border-dark-600 text-white ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                    )}
                  </>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            {isSignUp && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-800 text-light-300">Or sign up with</span>
                  </div>
                </div>

                {/* Social Sign-in Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="ghost"
                    className="bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex flex-col items-center justify-center h-auto"
                    onClick={() => handleSocialSignIn("gmail")}
                    disabled={isGoogleLoading}
                  >
                    <div className="bg-[#EA4335] w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      {isGoogleLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">Gmail</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex flex-col items-center justify-center h-auto"
                    onClick={() => handleSocialSignIn("twitter")}
                    disabled={isLoading}
                  >
                    <div className="bg-[#1DA1F2] w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="white"/>
                      </svg>
                    </div>
                    <span className="text-sm">Twitter</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex flex-col items-center justify-center h-auto"
                    onClick={() => handleSocialSignIn("discord")}
                    disabled={isLoading}
                  >
                    <div className="bg-[#5865F2] w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="white"/>
                      </svg>
                    </div>
                    <span className="text-sm">Discord</span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-800 text-light-300">Or connect with wallet</span>
                  </div>
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-light-300">Or connect with wallet</span>
                </div>
              </div>
            )}

            {/* Phantom */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => {
                console.log("[WalletModal] Phantom button clicked.");
                handleConnect("phantom");
              }}
              disabled={isConnecting}
            >
              <div className="bg-[#AB9FF2] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M64 0C28.7 0 0 28.7 0 64C0 99.3 28.7 128 64 128C99.3 128 128 99.3 128 64C128 28.7 99.3 0 64 0ZM64 96.9C46.8 96.9 32.8 82.9 32.8 65.7C32.8 48.4 46.8 34.5 64 34.5C81.2 34.5 95.2 48.5 95.2 65.7C95.2 82.9 81.2 96.9 64 96.9Z" fill="white"/>
                  <path d="M84.2 44.8H59.1C57.3 44.8 55.9 46.2 55.9 48C55.9 49.8 57.3 51.2 59.1 51.2H59.5C60.9 51.2 62.1 52.1 62.6 53.4L65.1 60.3C65.7 61.9 67.1 63 68.8 63H80.2C82.7 63 85 60.9 85.2 58.4L85.9 47.6C85.9 47.4 85.9 47.3 85.9 47.1C85.9 45.8 85.2 44.8 84.2 44.8Z" fill="white"/>
                  <path d="M80.8 67.4H69.7C68.2 67.4 66.9 66.4 66.3 65.1L63.3 57.4C62.7 56 61.3 55.1 59.8 55.1H57.1C55.3 55.1 53.9 56.5 53.9 58.3C53.9 60.1 55.3 61.5 57.1 61.5H57.6C58.9 61.5 60.1 62.4 60.6 63.7L63.1 70.6C63.7 72.2 65.1 73.3 66.8 73.3H78.2C80.7 73.3 83 71.2 83.2 68.7L83.4 67.3C83.5 67.3 82.3 67.4 80.8 67.4Z" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Phantom</div>
                <div className="text-sm text-light-300">Connect with Phantom Wallet</div>
              </div>
              {selectedWallet === "phantom" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
            
            {/* Solflare */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => handleConnect("solflare")}
              disabled={isConnecting}
            >
              <div className="bg-[#FE9D32] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM16 26.5C9.649 26.5 4.5 21.351 4.5 15C4.5 8.649 9.649 3.5 16 3.5C22.351 3.5 27.5 8.649 27.5 15C27.5 21.351 22.351 26.5 16 26.5Z" fill="white"/>
                  <path d="M16 7C13.386 7 11.277 8.985 11.277 11.444C11.277 13.904 13.386 15.889 16 15.889C18.614 15.889 20.723 13.904 20.723 11.444C20.723 8.985 18.614 7 16 7Z" fill="white"/>
                  <path d="M16 20.25C11.029 20.25 7 18.25 7 15.75V19.25C7 21.75 11.029 23.75 16 23.75C20.971 23.75 25 21.75 25 19.25V15.75C25 18.25 20.971 20.25 16 20.25Z" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Solflare</div>
                <div className="text-sm text-light-300">Connect with Solflare Wallet</div>
              </div>
              {selectedWallet === "solflare" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
            
            {/* Other Wallets */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => handleConnect("other")}
              disabled={isConnecting}
            >
              <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Other Wallets</div>
                <div className="text-sm text-light-300">View more wallet options</div>
              </div>
              {selectedWallet === "other" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-light-300 text-center mt-4">
            By {isSignUp ? "creating an account" : "signing in"}, you agree to our{" "}
            <Link href="/legal#terms" className="text-primary hover:underline">
              Terms and Agreements
            </Link>
            ,{" "}
            <Link href="/legal#privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/legal#cookies" className="text-primary hover:underline">
              Cookies
            </Link>
            , and{" "}
            <Link href="/legal#disclaimers" className="text-primary hover:underline">
              Disclaimers
            </Link>
            .
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
