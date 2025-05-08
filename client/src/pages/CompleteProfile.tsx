import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/lib/supabase';

interface ProfileFormData {
  displayName: string;
  email: string;
  bio: string;
  profilePicture: File | null;
}

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    email: '',
    bio: '',
    profilePicture: null
  });

  useEffect(() => {
    // Check for temporary wallet data
    const tempWalletData = localStorage.getItem('tempWalletData');
    if (!tempWalletData) {
      // No temporary data found, redirect to home
      setLocation('/');
      return;
    }

    // Clean up old temporary data
    const data = JSON.parse(tempWalletData);
    if (Date.now() - data.timestamp > 3600000) {
      // Data is older than 1 hour
      localStorage.removeItem('tempWalletData');
      setLocation('/');
      return;
    }

    // Set wallet address from temporary data
    setWalletAddress(data.publicKey);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate a valid email for Supabase Auth
      const authEmail = `${user.publicKey.slice(0, 8)}@cryptoteahouse.com`;
      const password = `${user.publicKey.slice(0, 16)}!`; // Add special char to meet password requirements

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            publicKey: user.publicKey
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user data returned from signup");

      // Create user record in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            publicKey: user.publicKey,
            email: authEmail
          }
        ])
        .select()
        .single();

      if (userError) {
        // Clean up auth user if user creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      // Handle profile picture upload if selected
      let profilePictureUrl: string | undefined = undefined;
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop() || 'png';
        const fileName = `${authData.user.id}/profile.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, formData.profilePicture, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);
          profilePictureUrl = data.publicUrl;
        }
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: formData.displayName,
            displayName: formData.displayName,
            bio: formData.bio,
            profilePictureUrl: profilePictureUrl,
            isProfileComplete: true
          }
        ]);

      if (profileError) {
        // Clean up if profile creation fails
        await supabase.from('users').delete().eq('id', authData.user.id);
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      // Update wallet context with new user data
      setUser({
        id: authData.user.id,
        publicKey: user.publicKey,
        email: authEmail,
        username: formData.displayName,
        name: formData.displayName,
        picture: profilePictureUrl,
        provider: 'wallet'
      });

      toast({
        title: "Success",
        description: "Profile created successfully!"
      });
      setLocation('/dashboard');
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add profile picture preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
            {/* Wallet Address (Read-only) */}
            <div className="space-y-3">
              <label htmlFor="walletAddress" className="block text-sm font-medium text-white">
                Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="walletAddress"
                  value={walletAddress}
                  readOnly
                  className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white/70 cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-light-300">
                This is your connected wallet address
              </p>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email address"
              />
              <p className="text-sm text-light-300">
                This will be used for account notifications and communications
              </p>
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Profile Picture
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-dark-700 flex items-center justify-center border-2 border-dashed border-dark-600">
                      <svg className="w-12 h-12 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="block w-full text-sm text-white
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-dark-900
                      hover:file:bg-primary/90
                      cursor-pointer"
                  />
                  <p className="mt-2 text-sm text-light-300">
                    Upload a profile picture (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-3">
              <label htmlFor="displayName" className="block text-sm font-medium text-white">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <label htmlFor="bio" className="block text-sm font-medium text-white">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell us about yourself"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing Profile...
                </div>
              ) : (
                'Complete Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 