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
  newsletterOptIn: boolean;
  bio: string;
  profilePicture: File | null;
}

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    email: user?.email || '',
    newsletterOptIn: false,
    bio: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    // Validate display name
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 3) {
      newErrors.displayName = 'Display name must be at least 3 characters';
    } else {
      // Check if display name is unique
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', formData.displayName)
        .single();

      if (existingUser) {
        newErrors.displayName = 'This display name is already taken';
      }
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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

      let profilePictureUrl = null;

      // Upload profile picture if selected
      if (formData.profilePicture) {
        // First validate the file
        const validationFormData = new FormData();
        validationFormData.append('file', formData.profilePicture);

        const { data: validationData, error: validationError } = await supabase.functions.invoke('validate-upload', {
          body: validationFormData
        });

        if (validationError) {
          throw new Error(validationError.message);
        }

        if (!validationData.success) {
          throw new Error('File validation failed');
        }

        // If validation passes, upload the file
        const fileExt = formData.profilePicture.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, formData.profilePicture);

        if (uploadError) throw uploadError;
        profilePictureUrl = uploadData.path;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user?.id,
          display_name: formData.displayName,
          email: formData.email,
          bio: formData.bio || null,
          profile_picture: profilePictureUrl,
          newsletter_opt_in: formData.newsletterOptIn,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          auth_provider: user?.provider || 'google',
          auth_provider_id: user?.id
        });

      if (profileError) throw profileError;

      toast({
        title: 'Profile Created',
        description: 'Your profile has been successfully created!',
      });

      setLocation('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-light-300">Complete Your Profile</h2>
          <p className="mt-2 text-light-400">Please provide some additional information to get started.</p>
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-300">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md bg-dark-800 border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } text-light-300 px-3 py-2`}
              placeholder="Your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                  src={previewUrl || '/default-avatar.png'}
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
                  Upload a profile picture (optional)
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
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 