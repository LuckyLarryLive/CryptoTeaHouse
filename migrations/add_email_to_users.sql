-- Add email column to users table
ALTER TABLE users
ADD COLUMN email text NOT NULL DEFAULT '';

-- Remove the default after adding the column
ALTER TABLE users
ALTER COLUMN email DROP DEFAULT;

-- Add comment to the column
COMMENT ON COLUMN users.email IS 'User email address used for authentication'; 