-- Add is_profile_complete column to profiles table
ALTER TABLE profiles
ADD COLUMN is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing profiles to be marked as complete
UPDATE profiles
SET is_profile_complete = TRUE
WHERE auth_provider_id IS NOT NULL;

-- Add comment to the column
COMMENT ON COLUMN profiles.is_profile_complete IS 'Indicates whether the user has completed their profile setup'; 