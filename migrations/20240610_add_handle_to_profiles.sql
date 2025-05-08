-- Add handle column to profiles table
ALTER TABLE profiles ADD COLUMN handle text;

-- Assign temporary handles to existing users (e.g., user{id})
UPDATE profiles SET handle = 'user' || id WHERE handle IS NULL;

-- Set NOT NULL, UNIQUE, and format CHECK constraints
ALTER TABLE profiles ALTER COLUMN handle SET NOT NULL;
ALTER TABLE profiles ADD CONSTRAINT profiles_handle_unique UNIQUE (handle);
ALTER TABLE profiles ADD CONSTRAINT profiles_handle_format CHECK (handle ~ '^[a-z0-9_]+$'); 