-- Allow null email in users table
ALTER TABLE users
ALTER COLUMN email DROP NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN users.email IS 'User email address, can be null for wallet-only users';

-- Ensure created_at has a default value
ALTER TABLE users
ALTER COLUMN created_at SET DEFAULT now();

-- Add comment to explain the change
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created, defaults to now()'; 