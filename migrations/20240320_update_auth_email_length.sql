-- First, drop the generated column
ALTER TABLE auth.identities DROP COLUMN IF EXISTS email;

-- Update the identity_data column type
ALTER TABLE auth.identities
ALTER COLUMN identity_data TYPE jsonb;

-- Recreate the email column as a regular column with increased length
ALTER TABLE auth.identities
ADD COLUMN email varchar(255);

-- Add comment to explain the change
COMMENT ON COLUMN auth.identities.email IS 'User email address with increased length limit for wallet authentication';

-- Update the auth.users table email length
ALTER TABLE auth.users
ALTER COLUMN email TYPE varchar(255);

-- Add comment to explain the change
COMMENT ON COLUMN auth.users.email IS 'User email address with increased length limit for wallet authentication'; 