import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { supabase, storageClient } from '@/lib/supabase';

interface ProfileFormData {
  displayName: string;
  handle: string;
  email: string;
  bio: string;
  profilePicture: File | null;
  newsletterOptIn: boolean;
}

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    handle: '',
    email: '',
    bio: '',
    profilePicture: null,
    newsletterOptIn: false
  });

  // Handle handle validation
  const [handleError, setHandleError] = useState<string | null>(null);
  const [handleChecking, setHandleChecking] = useState(false);

  const validateHandle = async (handle: string) => {
    if (!/^[a-z0-9_]+$/.test(handle)) {
      setHandleError('Handle must be lowercase letters, numbers, or underscores only.');
      return false;
    }
    setHandleChecking(true);
    try {
      const { data: existing, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('handle', handle)
        .maybeSingle();

      if (error) {
        // This will only trigger for actual errors, not "not found" cases
        console.error('Error checking handle:', error);
        setHandleError('Error checking handle availability. Please try again.');
        return false;
      }

      if (existing) {
        setHandleError('This handle is already taken.');
        return false;
      }

      setHandleError(null);
      return true;
    } catch (error) {
      console.error('Error validating handle:', error);
      setHandleError('Error checking handle availability. Please try again.');
      return false;
    } finally {
      setHandleChecking(false);
    }
  };

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

  // Add effect to handle navigation after successful submission
  useEffect(() => {
    if (submissionSuccessful && user?.is_profile_complete === true) {
      console.log('[CompleteProfile] Navigation effect triggered:', {
        submissionSuccessful,
        isProfileComplete: user.is_profile_complete,
        userState: JSON.stringify(user, null, 2)
      });
      
      // Clean up temporary data
      localStorage.removeItem('tempWalletData');
      
      // Navigate to dashboard
      setLocation('/dashboard');
    }
  }, [submissionSuccessful, user, setLocation]);

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
      setIsLoading(true);
      console.log('Starting profile completion...', {
        publicKey: user.publicKey,
        email: formData.email
      });

      // Get the current user
      let { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        console.log('No existing auth session, attempting sign in...');
        // If no auth session, try to sign in with the wallet
        const { data: { user: authUser, session }, error: signInError } = await supabase.auth.signInWithPassword({
          email: `${user.publicKey.toLowerCase()}@wallet.local`,
          password: user.publicKey
        });

        if (signInError || !authUser) {
          console.log('Sign in failed, creating new user...');
          // If sign in fails, create a new user
          const { data: { user: newUser }, error: createError } = await supabase.auth.signUp({
            email: `${user.publicKey.toLowerCase()}@wallet.local`,
            password: user.publicKey
          });

          if (createError || !newUser) {
            throw new Error("Failed to create user account");
          }

          currentUser = newUser;
          console.log('New user created:', currentUser.id);
        } else {
          currentUser = authUser;
          console.log('Existing user found:', currentUser.id);
        }
      }

      // Update or create user record
      console.log('Updating user record...');
      const { error: userUpdateError } = await supabase
        .from('users')
        .upsert({
          id: currentUser.id,
          public_key: user.publicKey,
          email: formData.email,
          last_login_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (userUpdateError) {
        console.error('Error updating user record:', userUpdateError);
        throw new Error("Failed to update user record");
      }
      console.log('User record updated successfully');

      // Handle profile picture upload if selected
      let profilePictureUrl: string | undefined = undefined;
      if (formData.profilePicture) {
        try {
          console.log('Uploading profile picture...');
          const file = formData.profilePicture;
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
          const fileName = `${currentUser.id}/profile.${fileExt}`;

          const { error: uploadError } = await storageClient.storage
            .from('profile-pictures')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = storageClient.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);
          
          profilePictureUrl = publicUrl;
          console.log('Profile picture uploaded successfully:', publicUrl);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          toast({
            title: "Warning",
            description: "Failed to upload profile picture. Continuing with profile creation...",
            variant: "destructive"
          });
        }
      }

      // Create profile
      console.log('Creating profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: currentUser.id,
            display_name: formData.displayName,
            handle: formData.handle,
            email: formData.email,
            bio: formData.bio,
            profile_picture_url: profilePictureUrl || null,
            is_profile_complete: true,
            auth_provider_id: user.publicKey,
            newsletter_opt_in: formData.newsletterOptIn,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }
      console.log('Profile created successfully');

      // Wait for all operations to complete
      console.log('Initializing user data...');
      await Promise.all([
        // Initialize user stats
        supabase.from('user_stats').upsert([
          {
            user_id: currentUser.id,
            current_daily_tickets: 0,
            current_weekly_tickets: 0,
            current_monthly_tickets: 0,
            current_yearly_tickets: 0,
            lifetime_daily_tickets: 0,
            lifetime_weekly_tickets: 0,
            lifetime_monthly_tickets: 0,
            lifetime_yearly_tickets: 0,
            daily_pull_count: 0,
            daily_raffle_win_count: 0,
            daily_reward_win_count: 0,
            lifetime_pull_count: 0,
            lifetime_raffle_win_count: 0,
            lifetime_reward_win_count: 0,
            total_sol_spent: "0",
            total_reward_buybacks: "0",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]),
        // Create initial activity
        supabase.from('activities').insert([
          {
            user_id: currentUser.id,
            type: 'profile_created',
            details: {
              message: 'Profile created successfully'
            },
            created_at: new Date().toISOString()
          }
        ])
      ]);
      console.log('User data initialized successfully');

      // Update wallet context with new user data
      const updatedUser = {
        id: currentUser.id,
        publicKey: user.publicKey,
        email: formData.email,
        username: formData.displayName,
        name: formData.displayName,
        picture: profilePictureUrl,
        provider: 'wallet' as const,
        is_profile_complete: true
      };
      
      console.log('[CompleteProfile] Setting user state:', {
        before: user,
        after: updatedUser,
        isProfileComplete: updatedUser.is_profile_complete
      });
      
      setUser(updatedUser);
      setSubmissionSuccessful(true); // Set flag after state update
      
      console.log('[CompleteProfile] User state updated and submission marked successful');

      console.log('Profile completion finished successfully');
      toast({
        title: "Success",
        description: "Profile created successfully!"
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureUpload = async (file: File) => {
    try {
      if (!user?.id) {
        throw new Error('No user ID available');
      }

      // Log file details before upload
      console.log('File details before upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        isFile: file instanceof File
      });

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `profile.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage with explicit content type
      const { error: uploadError } = await storageClient.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type // Ensure we use the file's actual MIME type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = storageClient.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      console.log('Profile picture uploaded successfully:', {
        publicUrl,
        filePath,
        contentType: file.type
      });

      // Update profile with the new picture URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          profile_picture_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile with picture URL:', updateError);
        throw updateError;
      }

      // Update local state
      setProfilePicture(publicUrl);
      setUser({
        ...user,
        picture: publicUrl,
        is_profile_complete: user.is_profile_complete
      });

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
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

            {/* Handle */}
            <div className="space-y-3">
              <label htmlFor="handle" className="block text-sm font-medium text-white">
                @Handle
              </label>
              <input
                type="text"
                id="handle"
                value={formData.handle}
                onChange={async (e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, handle: value }));
                  if (value.length > 2) await validateHandle(value);
                  else setHandleError('Handle must be at least 3 characters.');
                }}
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Choose your unique @handle"
              />
              {handleChecking && <p className="text-sm text-light-400">Checking handle...</p>}
              {handleError && <p className="text-sm text-red-400">{handleError}</p>}
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

            {/* Newsletter Opt-in */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletterOptIn"
                name="newsletterOptIn"
                checked={formData.newsletterOptIn}
                onChange={(e) => setFormData(prev => ({ ...prev, newsletterOptIn: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-700 bg-dark-800 text-primary focus:ring-primary"
              />
              <label htmlFor="newsletterOptIn" className="ml-2 block text-sm text-light-300">
                Subscribe to our newsletter
              </label>
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