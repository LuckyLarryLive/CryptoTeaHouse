-- Drop existing foreign key constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_user_id_fkey;
ALTER TABLE winners DROP CONSTRAINT IF EXISTS winners_user_id_fkey;
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_user_id_fkey;
ALTER TABLE ticket_purchases DROP CONSTRAINT IF EXISTS ticket_purchases_user_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referrer_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_id_fkey;
ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_fkey;

-- Add new UUID columns
ALTER TABLE users ADD COLUMN uuid_id uuid DEFAULT gen_random_uuid();
ALTER TABLE profiles ADD COLUMN uuid_id uuid;
ALTER TABLE tickets ADD COLUMN uuid_user_id uuid;
ALTER TABLE winners ADD COLUMN uuid_user_id uuid;
ALTER TABLE activities ADD COLUMN uuid_user_id uuid;
ALTER TABLE ticket_purchases ADD COLUMN uuid_user_id uuid;
ALTER TABLE referrals ADD COLUMN uuid_referrer_id uuid;
ALTER TABLE referrals ADD COLUMN uuid_referred_id uuid;
ALTER TABLE user_stats ADD COLUMN uuid_user_id uuid;

-- Update the new UUID columns with values from the old columns
UPDATE users SET uuid_id = gen_random_uuid() WHERE uuid_id IS NULL;
UPDATE profiles p SET uuid_id = u.uuid_id FROM users u WHERE p.id::text = u.id::text;
UPDATE tickets t SET uuid_user_id = u.uuid_id FROM users u WHERE t.user_id::text = u.id::text;
UPDATE winners w SET uuid_user_id = u.uuid_id FROM users u WHERE w.user_id::text = u.id::text;
UPDATE activities a SET uuid_user_id = u.uuid_id FROM users u WHERE a.user_id::text = u.id::text;
UPDATE ticket_purchases tp SET uuid_user_id = u.uuid_id FROM users u WHERE tp.user_id::text = u.id::text;
UPDATE referrals r SET uuid_referrer_id = u.uuid_id FROM users u WHERE r.referrer_id::text = u.id::text;
UPDATE referrals r SET uuid_referred_id = u.uuid_id FROM users u WHERE r.referred_id::text = u.id::text;
UPDATE user_stats us SET uuid_user_id = u.uuid_id FROM users u WHERE us.user_id::text = u.id::text;

-- Make the new UUID columns NOT NULL
ALTER TABLE users ALTER COLUMN uuid_id SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN uuid_id SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN uuid_user_id SET NOT NULL;
ALTER TABLE winners ALTER COLUMN uuid_user_id SET NOT NULL;
ALTER TABLE activities ALTER COLUMN uuid_user_id SET NOT NULL;
ALTER TABLE ticket_purchases ALTER COLUMN uuid_user_id SET NOT NULL;
ALTER TABLE referrals ALTER COLUMN uuid_referrer_id SET NOT NULL;
ALTER TABLE referrals ALTER COLUMN uuid_referred_id SET NOT NULL;
ALTER TABLE user_stats ALTER COLUMN uuid_user_id SET NOT NULL;

-- Drop old columns
ALTER TABLE users DROP COLUMN id;
ALTER TABLE profiles DROP COLUMN id;
ALTER TABLE tickets DROP COLUMN user_id;
ALTER TABLE winners DROP COLUMN user_id;
ALTER TABLE activities DROP COLUMN user_id;
ALTER TABLE ticket_purchases DROP COLUMN user_id;
ALTER TABLE referrals DROP COLUMN referrer_id;
ALTER TABLE referrals DROP COLUMN referred_id;
ALTER TABLE user_stats DROP COLUMN user_id;

-- Rename new columns to original names
ALTER TABLE users RENAME COLUMN uuid_id TO id;
ALTER TABLE profiles RENAME COLUMN uuid_id TO id;
ALTER TABLE tickets RENAME COLUMN uuid_user_id TO user_id;
ALTER TABLE winners RENAME COLUMN uuid_user_id TO user_id;
ALTER TABLE activities RENAME COLUMN uuid_user_id TO user_id;
ALTER TABLE ticket_purchases RENAME COLUMN uuid_user_id TO user_id;
ALTER TABLE referrals RENAME COLUMN uuid_referrer_id TO referrer_id;
ALTER TABLE referrals RENAME COLUMN uuid_referred_id TO referred_id;
ALTER TABLE user_stats RENAME COLUMN uuid_user_id TO user_id;

-- Add primary key constraints
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE user_stats ADD PRIMARY KEY (user_id);

-- Re-add foreign key constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES users(id);
ALTER TABLE tickets ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE winners ADD CONSTRAINT winners_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE activities ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ticket_purchases ADD CONSTRAINT ticket_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES users(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_referred_id_fkey FOREIGN KEY (referred_id) REFERENCES users(id);
ALTER TABLE user_stats ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id); 