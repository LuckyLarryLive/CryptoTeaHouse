-- First, drop any existing NOT NULL constraint
ALTER TABLE users
ALTER COLUMN email DROP NOT NULL;

-- Then, ensure the column type is correct
ALTER TABLE users
ALTER COLUMN email TYPE varchar(255);

-- Add a comment to explain the change
COMMENT ON COLUMN users.email IS 'User email address, can be null for wallet-only users';

-- Verify the change by checking if the column is nullable
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'email'
        AND is_nullable = 'NO'
    ) THEN
        RAISE EXCEPTION 'Email column is still NOT NULL after migration';
    END IF;
END $$; 