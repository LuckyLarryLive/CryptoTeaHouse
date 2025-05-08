# Database Schema Documentation

## Authentication Tables

### auth.users
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) - User's email address, supports wallet authentication emails
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### auth.identities
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `identity_data`: JSONB - Contains authentication provider data
- `email`: VARCHAR(255) - User's email address, supports wallet authentication emails

## Application Tables

### users
- `id`: UUID (Primary Key)
- `public_key`: TEXT - User's wallet public key
- `email`: VARCHAR(255) - User's email address
- `last_login_at`: TIMESTAMP
- `created_at`: TIMESTAMP

### profiles
- `id`: UUID (Primary Key, Foreign Key to users.id)
- `display_name`: TEXT
- `email`: VARCHAR(255) - User's email address
- `bio`: TEXT
- `profile_picture_url`: TEXT
- `is_profile_complete`: BOOLEAN
- `auth_provider_id`: TEXT
- `handle`: TEXT (Unique)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Email Field Requirements

The email field has been updated to support longer email addresses (up to 255 characters) to accommodate wallet authentication emails. This change affects:

1. `auth.users.email`
2. `auth.identities.email`
3. `users.email`
4. `profiles.email`

### Email Format for Wallet Authentication

When using wallet authentication, the email format is:
```
wallet_{publicKey}@auth.local
```

Where:
- `publicKey` is the user's wallet public key in lowercase
- The total length of the email will be: `wallet_` (7) + public key length + `@auth.local` (10)

### Validation

- Maximum length: 255 characters
- Must be a valid email format
- Must be unique within each table
- For wallet authentication emails, the public key portion must be a valid Solana public key

## Indexes

- `profiles_email_idx`: Index on profiles.email for faster lookups
- `users_public_key_unique`: Unique index on users.public_key
- `profiles_handle_unique`: Unique index on profiles.handle 