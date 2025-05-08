-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow profile picture uploads" ON storage.objects;

-- Create a storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies if they don't exist
DO $$ 
BEGIN
    -- Allow public read access to profile pictures
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Profile pictures are publicly accessible'
    ) THEN
        CREATE POLICY "Profile pictures are publicly accessible"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'profile-pictures');
    END IF;

    -- Allow profile picture uploads during profile creation
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow profile picture uploads'
    ) THEN
        CREATE POLICY "Allow profile picture uploads"
        ON storage.objects FOR INSERT
        TO public
        WITH CHECK (
            bucket_id = 'profile-pictures' AND
            (storage.foldername(name))[1] IS NOT NULL
        );
    END IF;

    -- Allow users to update their own profile pictures
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can update their own profile pictures'
    ) THEN
        CREATE POLICY "Users can update their own profile pictures"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (
            bucket_id = 'profile-pictures' AND
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;

    -- Allow users to delete their own profile pictures
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can delete their own profile pictures'
    ) THEN
        CREATE POLICY "Users can delete their own profile pictures"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
            bucket_id = 'profile-pictures' AND
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;
END $$; 