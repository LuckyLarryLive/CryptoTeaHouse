-- Drop old integer-based foreign key constraints
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_user_id_fkey;
ALTER TABLE winners DROP CONSTRAINT IF EXISTS winners_user_id_fkey;
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_user_id_fkey;
ALTER TABLE ticket_purchases DROP CONSTRAINT IF EXISTS ticket_purchases_user_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referrer_id_fkey;
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_id_fkey;
ALTER TABLE user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_fkey;

-- Rename old columns
ALTER TABLE tickets RENAME COLUMN user_id TO old_user_id;
ALTER TABLE winners RENAME COLUMN user_id TO old_user_id;
ALTER TABLE activities RENAME COLUMN user_id TO old_user_id;
ALTER TABLE ticket_purchases RENAME COLUMN user_id TO old_user_id;
ALTER TABLE referrals RENAME COLUMN referrer_id TO old_referrer_id;
ALTER TABLE referrals RENAME COLUMN referred_id TO old_referred_id;
ALTER TABLE user_stats RENAME COLUMN user_id TO old_user_id;

-- Add new UUID columns
ALTER TABLE tickets ADD COLUMN user_id uuid;
ALTER TABLE winners ADD COLUMN user_id uuid;
ALTER TABLE activities ADD COLUMN user_id uuid;
ALTER TABLE ticket_purchases ADD COLUMN user_id uuid;
ALTER TABLE referrals ADD COLUMN referrer_id uuid;
ALTER TABLE referrals ADD COLUMN referred_id uuid;
ALTER TABLE user_stats ADD COLUMN user_id uuid;

-- Update new columns with values from users table
UPDATE tickets t SET user_id = u.id FROM users u WHERE t.old_user_id::text = u.id::text;
UPDATE winners w SET user_id = u.id FROM users u WHERE w.old_user_id::text = u.id::text;
UPDATE activities a SET user_id = u.id FROM users u WHERE a.old_user_id::text = u.id::text;
UPDATE ticket_purchases tp SET user_id = u.id FROM users u WHERE tp.old_user_id::text = u.id::text;
UPDATE referrals r SET referrer_id = u.id FROM users u WHERE r.old_referrer_id::text = u.id::text;
UPDATE referrals r SET referred_id = u.id FROM users u WHERE r.old_referred_id::text = u.id::text;
UPDATE user_stats us SET user_id = u.id FROM users u WHERE us.old_user_id::text = u.id::text;

-- Add new foreign key constraints
ALTER TABLE tickets ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE winners ADD CONSTRAINT winners_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE activities ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ticket_purchases ADD CONSTRAINT ticket_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES users(id);
ALTER TABLE referrals ADD CONSTRAINT referrals_referred_id_fkey FOREIGN KEY (referred_id) REFERENCES users(id);
ALTER TABLE user_stats ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- Drop old columns
ALTER TABLE tickets DROP COLUMN old_user_id;
ALTER TABLE winners DROP COLUMN old_user_id;
ALTER TABLE activities DROP COLUMN old_user_id;
ALTER TABLE ticket_purchases DROP COLUMN old_user_id;
ALTER TABLE referrals DROP COLUMN old_referrer_id;
ALTER TABLE referrals DROP COLUMN old_referred_id;
ALTER TABLE user_stats DROP COLUMN old_user_id; 