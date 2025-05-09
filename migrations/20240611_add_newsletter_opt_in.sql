-- Add newsletter_opt_in column to profiles table
ALTER TABLE profiles
ADD COLUMN newsletter_opt_in BOOLEAN NOT NULL DEFAULT false;

-- Add comment to the column
COMMENT ON COLUMN profiles.newsletter_opt_in IS 'Indicates whether the user has opted in to receive newsletters'; 