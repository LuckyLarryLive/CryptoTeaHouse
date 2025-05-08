-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create new policies
-- Allow querying by auth_provider_id for unauthenticated users
CREATE POLICY "Allow querying by auth_provider_id"
ON profiles FOR SELECT
TO public
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_auth_provider_id_idx ON profiles(auth_provider_id); 