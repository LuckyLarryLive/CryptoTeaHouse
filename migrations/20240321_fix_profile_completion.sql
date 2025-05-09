-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "User stats are viewable by owner" ON user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;

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

-- Allow initial user creation with just public_key
CREATE POLICY "Users can insert their own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  public_key IS NOT NULL
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

-- Create policies for user_stats table
CREATE POLICY "User stats are viewable by owner"
ON user_stats FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own stats"
ON user_stats FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own stats"
ON user_stats FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add comments to explain the policies
COMMENT ON POLICY "Users can view their own data" ON users IS 'Allow users to read only their own data';
COMMENT ON POLICY "Users can update their own data" ON users IS 'Allow users to update their own data';
COMMENT ON POLICY "Users can insert their own data" ON users IS 'Allow users to create their own user record with public key';
COMMENT ON POLICY "Profiles are viewable by everyone" ON profiles IS 'Allow public read access to profiles';
COMMENT ON POLICY "Users can update their own profile" ON profiles IS 'Allow users to update their own profile';
COMMENT ON POLICY "Users can insert their own profile" ON profiles IS 'Allow users to create their own profile';
COMMENT ON POLICY "User stats are viewable by owner" ON user_stats IS 'Allow users to view their own stats';
COMMENT ON POLICY "Users can insert their own stats" ON user_stats IS 'Allow users to create their own stats';
COMMENT ON POLICY "Users can update their own stats" ON user_stats IS 'Allow users to update their own stats';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS users_public_key_idx ON users(public_key);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS profiles_auth_provider_id_idx ON profiles(auth_provider_id);
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON profiles(handle);
CREATE INDEX IF NOT EXISTS user_stats_user_id_idx ON user_stats(user_id); 