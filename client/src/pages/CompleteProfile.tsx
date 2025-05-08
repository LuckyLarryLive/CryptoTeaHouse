import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tempWalletData = localStorage.getItem('tempWalletData');
      if (!tempWalletData) {
        throw new Error('No wallet data found. Please connect your wallet again.');
      }

      const { publicKey } = JSON.parse(tempWalletData);

      // Create the user account
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: crypto.randomUUID(), // Generate a random password since we'll use wallet for auth
        options: {
          data: {
            public_key: publicKey,
            display_name: formData.displayName,
            provider: 'wallet'
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('No user data received after sign up');

      // Create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          auth_provider: 'wallet',
          auth_provider_id: publicKey,
          display_name: formData.displayName,
          email: formData.email,
          bio: formData.bio,
          is_profile_complete: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Upload profile picture if provided
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop();
        const filePath = `${newUser.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, formData.profilePicture);

        if (uploadError) {
          console.error('Error uploading profile picture:', uploadError);
          // Don't throw, continue with profile creation
        } else {
          // Update profile with picture URL
          const { data: { publicUrl } } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);

          await supabase
            .from('profiles')
            .update({ picture_url: publicUrl })
            .eq('id', newUser.id);
        }
      }

      // Update context with new user data
      setUser({
        id: parseInt(newUser.id),
        publicKey,
        email: formData.email,
        name: formData.displayName,
        provider: 'wallet'
      });

      // Clean up temporary data
      localStorage.removeItem('tempWalletData');

      toast({
        title: "Success",
        description: "Profile created successfully!",
      });

      // Redirect to dashboard
      setLocation('/dashboard');

    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.files?.[0] || null }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
} 