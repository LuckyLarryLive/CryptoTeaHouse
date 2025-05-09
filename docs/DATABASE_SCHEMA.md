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
- `public_key`: TEXT (Not Null, Unique) - User's wallet public key
- `email`: VARCHAR(255) (Not Null) - User's email address
- `last_login_at`: TIMESTAMP (Not Null, Default: Now)
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### profiles
- `id`: UUID (Primary Key, Foreign Key to users.id)
- `display_name`: TEXT (Not Null)
- `bio`: TEXT
- `profile_picture_url`: TEXT
- `is_profile_complete`: BOOLEAN (Not Null, Default: false)
- `auth_provider_id`: TEXT - Authentication provider ID (e.g., wallet public key)
- `handle`: TEXT (Not Null, Unique) - Format: lowercase letters, numbers, or underscores only
- `newsletter_opt_in`: BOOLEAN (Not Null, Default: false)
- `created_at`: TIMESTAMP (Not Null, Default: Now)
- `updated_at`: TIMESTAMP (Not Null, Default: Now)

### tickets
- `id`: SERIAL (Primary Key)
- `user_id`: UUID (Not Null, Foreign Key to users.id)
- `type`: TEXT (Not Null) - daily, weekly, monthly, yearly
- `quantity`: INTEGER (Not Null, Default: 1)
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### draws
- `id`: SERIAL (Primary Key)
- `type`: TEXT (Not Null) - daily, weekly, monthly, yearly
- `draw_time`: TIMESTAMP (Not Null)
- `status`: TEXT (Not Null, Default: "pending") - pending, completed
- `prize`: TEXT (Not Null) - Amount in SOL
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### winners
- `id`: SERIAL (Primary Key)
- `user_id`: UUID (Not Null, Foreign Key to users.id)
- `draw_id`: INTEGER (Not Null, Foreign Key to draws.id)
- `transaction_signature`: TEXT - Solana transaction ID
- `prize_claimed`: BOOLEAN (Not Null, Default: false)
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### activities
- `id`: SERIAL (Primary Key)
- `user_id`: UUID (Not Null, Foreign Key to users.id)
- `type`: TEXT (Not Null) - pull, reward, ticket_earned
- `details`: JSONB - Flexible JSON data
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### ticket_purchases
- `id`: SERIAL (Primary Key)
- `user_id`: UUID (Not Null, Foreign Key to users.id)
- `type`: TEXT (Not Null) - daily, weekly, monthly, yearly
- `quantity`: INTEGER (Not Null)
- `amount`: TEXT (Not Null) - Amount in SOL
- `transaction_signature`: TEXT - Solana transaction ID
- `status`: TEXT (Not Null, Default: "pending") - pending, completed, failed
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### prize_payouts
- `id`: SERIAL (Primary Key)
- `winner_id`: INTEGER (Not Null, Foreign Key to winners.id)
- `amount`: TEXT (Not Null) - Amount in SOL
- `transaction_signature`: TEXT - Solana transaction ID
- `status`: TEXT (Not Null, Default: "pending") - pending, completed, failed
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### settings
- `id`: SERIAL (Primary Key)
- `key`: TEXT (Not Null, Unique)
- `value`: JSONB (Not Null)
- `updated_at`: TIMESTAMP (Not Null, Default: Now)

### referrals
- `id`: SERIAL (Primary Key)
- `referrer_id`: UUID (Not Null, Foreign Key to users.id)
- `referred_id`: UUID (Not Null, Foreign Key to users.id)
- `reward`: TEXT - Amount in SOL
- `status`: TEXT (Not Null, Default: "pending") - pending, completed
- `created_at`: TIMESTAMP (Not Null, Default: Now)

### user_stats
- `user_id`: UUID (Primary Key, Foreign Key to users.id)
- Current ticket counts:
  - `current_daily_tickets`: INTEGER (Not Null, Default: 0)
  - `current_weekly_tickets`: INTEGER (Not Null, Default: 0)
  - `current_monthly_tickets`: INTEGER (Not Null, Default: 0)
  - `current_yearly_tickets`: INTEGER (Not Null, Default: 0)
- Lifetime ticket counts:
  - `lifetime_daily_tickets`: INTEGER (Not Null, Default: 0)
  - `lifetime_weekly_tickets`: INTEGER (Not Null, Default: 0)
  - `lifetime_monthly_tickets`: INTEGER (Not Null, Default: 0)
  - `lifetime_yearly_tickets`: INTEGER (Not Null, Default: 0)
- Daily pull counts:
  - `daily_pull_count`: INTEGER (Not Null, Default: 0)
  - `daily_raffle_win_count`: INTEGER (Not Null, Default: 0)
  - `daily_reward_win_count`: INTEGER (Not Null, Default: 0)
- Lifetime pull counts:
  - `lifetime_pull_count`: INTEGER (Not Null, Default: 0)
  - `lifetime_raffle_win_count`: INTEGER (Not Null, Default: 0)
  - `lifetime_reward_win_count`: INTEGER (Not Null, Default: 0)
- Financial statistics:
  - `total_sol_spent`: DECIMAL(20,9) (Not Null, Default: "0")
  - `total_reward_buybacks`: DECIMAL(20,9) (Not Null, Default: "0")
- Timestamps:
  - `last_pull_at`: TIMESTAMP
  - `created_at`: TIMESTAMP (Not Null, Default: Now)
  - `updated_at`: TIMESTAMP (Not Null, Default: Now)

## Row Level Security (RLS) Policies

### users
- `Users are viewable by everyone`: Public read access
- `Users can update their own data`: Authenticated users can update their own data

### profiles
- `Profiles are viewable by everyone`: Public read access
- `Users can update their own profile`: Authenticated users can update their own profile
- `Users can insert their own profile`: Authenticated users can create their own profile

### tickets
- `Tickets are viewable by owner`: Authenticated users can view their own tickets
- `Users can create their own tickets`: Authenticated users can create tickets for themselves

### draws
- `Draws are viewable by everyone`: Public read access

### winners
- `Winners are viewable by everyone`: Public read access

### activities
- `Activities are viewable by owner`: Authenticated users can view their own activities
- `Users can create their own activities`: Authenticated users can create activities for themselves

### ticket_purchases
- `Ticket purchases are viewable by owner`: Authenticated users can view their own purchases
- `Users can create their own ticket purchases`: Authenticated users can create purchases for themselves

### prize_payouts
- `Prize payouts are viewable by winner`: Winners can view their own payouts

### settings
- `Settings are viewable by everyone`: Public read access

### referrals
- `Referrals are viewable by participants`: Users can view referrals they are part of

### user_stats
- `User stats are viewable by owner`: Users can view their own stats

## Indexes

### profiles
- `profiles_display_name_idx`: Index on display_name
- `profiles_auth_provider_id_idx`: Index on auth_provider_id
- `profiles_handle_idx`: Unique index on handle

### users
- `users_public_key_idx`: Unique index on public_key
- `users_email_idx`: Index on email

### activities
- `activities_user_id_idx`: Index on user_id
- `activities_created_at_idx`: Index on created_at

### tickets
- `tickets_user_id_idx`: Index on user_id
- `tickets_type_idx`: Index on type

### draws
- `draws_type_idx`: Index on type
- `draws_draw_time_idx`: Index on draw_time

### winners
- `winners_user_id_idx`: Index on user_id
- `winners_draw_id_idx`: Index on draw_id

### ticket_purchases
- `ticket_purchases_user_id_idx`: Index on user_id
- `ticket_purchases_status_idx`: Index on status

### prize_payouts
- `prize_payouts_winner_id_idx`: Index on winner_id
- `prize_payouts_status_idx`: Index on status

### referrals
- `referrals_referrer_id_idx`: Index on referrer_id
- `referrals_referred_id_idx`: Index on referred_id

### user_stats
- `user_stats_user_id_idx`: Unique index on user_id

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