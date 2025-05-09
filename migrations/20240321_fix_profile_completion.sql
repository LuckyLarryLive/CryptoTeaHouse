-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create new policies for users table
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  public_key IS NOT NULL AND
  email IS NOT NULL
);

-- Create new policies for profiles table
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Add comments to explain the policies
COMMENT ON POLICY "Users can view their own data" ON users IS 'Allow users to read only their own data';
COMMENT ON POLICY "Users can update their own data" ON users IS 'Allow users to update their own data';
COMMENT ON POLICY "Users can insert their own data" ON users IS 'Allow users to create their own user record with required fields';
COMMENT ON POLICY "Profiles are viewable by everyone" ON profiles IS 'Allow public read access to profiles';
COMMENT ON POLICY "Users can update their own profile" ON profiles IS 'Allow users to update their own profile';
COMMENT ON POLICY "Users can insert their own profile" ON profiles IS 'Allow users to create their own profile';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS users_public_key_idx ON users(public_key);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS profiles_auth_provider_id_idx ON profiles(auth_provider_id);
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON profiles(handle); 