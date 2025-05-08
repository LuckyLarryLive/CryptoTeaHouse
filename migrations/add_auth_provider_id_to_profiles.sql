-- Add auth_provider_id column to profiles table
ALTER TABLE profiles
ADD COLUMN auth_provider_id text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_auth_provider_id_idx ON profiles(auth_provider_id);

-- Add comment to the column
COMMENT ON COLUMN profiles.auth_provider_id IS 'The ID from the authentication provider (e.g. wallet address, Google ID)'; 