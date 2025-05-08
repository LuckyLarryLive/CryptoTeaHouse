-- Update the function to handle null email values
CREATE OR REPLACE FUNCTION get_profile_by_wallet(wallet_address text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'id', id,
      'display_name', display_name,
      'email', COALESCE(email, ''),
      'profile_picture_url', profile_picture_url,
      'auth_provider_id', auth_provider_id
    )
    FROM profiles
    WHERE auth_provider_id = wallet_address
    LIMIT 1
  );
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_profile_by_wallet(text) TO anon, authenticated; 