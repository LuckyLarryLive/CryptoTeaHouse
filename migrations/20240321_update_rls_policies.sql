-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow querying by auth_provider_id" ON profiles;
DROP POLICY IF EXISTS "Tickets are viewable by owner" ON tickets;
DROP POLICY IF EXISTS "Users can create their own tickets" ON tickets;
DROP POLICY IF EXISTS "Draws are viewable by everyone" ON draws;
DROP POLICY IF EXISTS "Winners are viewable by everyone" ON winners;
DROP POLICY IF EXISTS "Activities are viewable by owner" ON activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON activities;
DROP POLICY IF EXISTS "Ticket purchases are viewable by owner" ON ticket_purchases;
DROP POLICY IF EXISTS "Users can create their own ticket purchases" ON ticket_purchases;
DROP POLICY IF EXISTS "Prize payouts are viewable by winner" ON prize_payouts;
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
DROP POLICY IF EXISTS "Referrals are viewable by participants" ON referrals;
DROP POLICY IF EXISTS "User stats are viewable by owner" ON user_stats;

-- Users policies
CREATE POLICY "Users are viewable by everyone"
ON users FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Profiles policies
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

-- Tickets policies
CREATE POLICY "Tickets are viewable by owner"
ON tickets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tickets"
ON tickets FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Draws policies
CREATE POLICY "Draws are viewable by everyone"
ON draws FOR SELECT
TO public
USING (true);

-- Winners policies
CREATE POLICY "Winners are viewable by everyone"
ON winners FOR SELECT
TO public
USING (true);

-- Activities policies
CREATE POLICY "Activities are viewable by owner"
ON activities FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own activities"
ON activities FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Ticket purchases policies
CREATE POLICY "Ticket purchases are viewable by owner"
ON ticket_purchases FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own ticket purchases"
ON ticket_purchases FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Prize payouts policies
CREATE POLICY "Prize payouts are viewable by winner"
ON prize_payouts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM winners w
    WHERE w.id = winner_id
    AND w.user_id = auth.uid()
  )
);

-- Settings policies
CREATE POLICY "Settings are viewable by everyone"
ON settings FOR SELECT
TO public
USING (true);

-- Referrals policies
CREATE POLICY "Referrals are viewable by participants"
ON referrals FOR SELECT
TO authenticated
USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- User stats policies
CREATE POLICY "User stats are viewable by owner"
ON user_stats FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Add comments to explain the policies
COMMENT ON POLICY "Users are viewable by everyone" ON users IS 'Allow public read access to user data';
COMMENT ON POLICY "Users can update their own data" ON users IS 'Allow users to update their own data';
COMMENT ON POLICY "Profiles are viewable by everyone" ON profiles IS 'Allow public read access to profiles';
COMMENT ON POLICY "Users can update their own profile" ON profiles IS 'Allow users to update their own profile';
COMMENT ON POLICY "Users can insert their own profile" ON profiles IS 'Allow users to create their own profile';
COMMENT ON POLICY "Tickets are viewable by owner" ON tickets IS 'Allow users to view their own tickets';
COMMENT ON POLICY "Users can create their own tickets" ON tickets IS 'Allow users to create tickets for themselves';
COMMENT ON POLICY "Draws are viewable by everyone" ON draws IS 'Allow public read access to draws';
COMMENT ON POLICY "Winners are viewable by everyone" ON winners IS 'Allow public read access to winners';
COMMENT ON POLICY "Activities are viewable by owner" ON activities IS 'Allow users to view their own activities';
COMMENT ON POLICY "Users can create their own activities" ON activities IS 'Allow users to create activities for themselves';
COMMENT ON POLICY "Ticket purchases are viewable by owner" ON ticket_purchases IS 'Allow users to view their own ticket purchases';
COMMENT ON POLICY "Users can create their own ticket purchases" ON ticket_purchases IS 'Allow users to create ticket purchases for themselves';
COMMENT ON POLICY "Prize payouts are viewable by winner" ON prize_payouts IS 'Allow winners to view their prize payouts';
COMMENT ON POLICY "Settings are viewable by everyone" ON settings IS 'Allow public read access to settings';
COMMENT ON POLICY "Referrals are viewable by participants" ON referrals IS 'Allow users to view referrals they are part of';
COMMENT ON POLICY "User stats are viewable by owner" ON user_stats IS 'Allow users to view their own stats'; 