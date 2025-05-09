-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS auth_provider_id text;

-- Update existing profiles to have auth_provider_id
UPDATE profiles p
SET auth_provider_id = u.public_key
FROM users u
WHERE p.id = u.id
AND p.auth_provider_id IS NULL;

-- Add index for auth_provider_id
CREATE INDEX IF NOT EXISTS profiles_auth_provider_id_idx ON profiles(auth_provider_id);

-- Add comment to explain the columns
COMMENT ON COLUMN profiles.newsletter_opt_in IS 'Whether the user has opted into the newsletter';
COMMENT ON COLUMN profiles.auth_provider_id IS 'The authentication provider ID (e.g., wallet public key)'; 