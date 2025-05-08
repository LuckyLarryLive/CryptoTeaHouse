-- Add email column to profiles table
ALTER TABLE profiles
ADD COLUMN email varchar(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Add comment to the column
COMMENT ON COLUMN profiles.email IS 'User email address with maximum length of 255 characters'; 