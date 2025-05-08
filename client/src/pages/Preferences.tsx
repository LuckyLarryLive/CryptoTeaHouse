import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface ProfileFormData {
  displayName: string;
  newsletterOptIn: boolean;
  bio: string;
  profilePicture: File | null;
}

export default function Preferences() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    newsletterOptIn: false,
    bio: '',
    profilePicture: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }

    // Fetch current profile data
    const fetchProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData({
            displayName: profile.display_name || '',
            newsletterOptIn: profile.newsletter_opt_in || false,
            bio: profile.bio || '',
            profilePicture: null,
          });
          setCurrentProfilePicture(profile.profile_picture_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      }
    };

    fetchProfile();
  }, [user, setLocation, toast]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    // Validate display name
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 3) {
      newErrors.displayName = 'Display name must be at least 3 characters';
    } else {
      // Check if display name is unique (excluding current user)
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', formData.displayName)
        .neq('id', user?.id)
        .single();

      if (existingUser) {
        newErrors.displayName = 'This display name is already taken';
      }
    }

    // Validate bio length
    if (formData.bio && formData.bio.length > 280) {
      newErrors.bio = 'Bio must be 280 characters or less';
    }

    // Validate profile picture
    if (formData.profilePicture) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(formData.profilePicture.type)) {
        newErrors.profilePicture = 'Only JPG, PNG, and GIF files are allowed';
      } else if (formData.profilePicture.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.profilePicture = 'Image must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profilePicture: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }

      let profilePictureUrl = currentProfilePicture;

      // Upload new profile picture if selected
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${user?.id}/profile.${fileExt}`;
        
        try {
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(formData.profilePicture.type)) {
            throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
          }

          // Validate file size (max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (formData.profilePicture.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
          }

          // Upload the file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, formData.profilePicture, {
              cacheControl: '3600',
              upsert: true,
              contentType: formData.profilePicture.type
            });

          if (uploadError) throw uploadError;

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);
            
          profilePictureUrl = publicUrl;
          console.log('Profile picture uploaded successfully:', publicUrl);

          // Delete old profile picture if it exists
          if (currentProfilePicture) {
            const oldFileName = currentProfilePicture.split('/').pop();
            if (oldFileName) {
              await supabase.storage
                .from('profile-pictures')
                .remove([`${user?.id}/${oldFileName}`]);
            }
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          toast({
            title: "Warning",
            description: error instanceof Error ? error.message : "Failed to upload profile picture. Continuing with profile update...",
            variant: "destructive"
          });
        }
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio || null,
          profile_picture_url: profilePictureUrl,
          newsletter_opt_in: formData.newsletterOptIn,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });

      setLocation('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-light-300">Profile Preferences</h2>
          <p className="mt-2 text-light-400">Update your profile information and preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-light-300">
              Display Name *
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md bg-dark-800 border ${
                errors.displayName ? 'border-red-500' : 'border-gray-700'
              } text-light-300 px-3 py-2`}
              placeholder="Choose a unique display name"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-light-300">
              Profile Picture
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="relative">
                <img
                  src={previewUrl || currentProfilePicture || '/images/default-avatar.png'}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-light-400">
                  Upload a new profile picture (optional)
                </p>
                <p className="text-xs text-light-500">
                  JPG, PNG, or GIF. Max 5MB.
                </p>
              </div>
            </div>
            {errors.profilePicture && (
              <p className="mt-1 text-sm text-red-500">{errors.profilePicture}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-light-300">
              Mini-Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={280}
              rows={3}
              className={`mt-1 block w-full rounded-md bg-dark-800 border ${
                errors.bio ? 'border-red-500' : 'border-gray-700'
              } text-light-300 px-3 py-2`}
              placeholder="Tell us a bit about yourself (max 280 characters)"
            />
            <p className="mt-1 text-sm text-light-500">
              {formData.bio.length}/280 characters
            </p>
            {errors.bio && (
              <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
            )}
          </div>

          {/* Newsletter Opt-in */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletterOptIn"
              name="newsletterOptIn"
              checked={formData.newsletterOptIn}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-700 bg-dark-800 text-primary focus:ring-primary"
            />
            <label htmlFor="newsletterOptIn" className="ml-2 block text-sm text-light-300">
              Subscribe to our newsletter
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 