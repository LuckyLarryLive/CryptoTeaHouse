# Crypto Tea House 🍵

![Crypto Tea House](generated-icon.png)

## 🌟 Welcome to Crypto Tea House

Crypto Tea House is your daily ritual for crypto fortune and rewards on the Solana blockchain. Connect your wallet, pull the Lucky Cat's paw, and discover your crypto fortune while earning real rewards!

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Solana CLI tools
- A Supabase account
- Git

### Environment Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptoteahouse.git
cd cryptoteahouse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Required variables:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
VITE_SOLANA_RPC_URL=your_solana_rpc_url
```

4. Initialize the database:
```bash
npm run db:push
```

### Development Workflow
1. Start the development server:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

3. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
cryptoteahouse/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (wallet, auth, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and services
│   │   └── pages/       # Page components
├── server/              # Backend Express application
│   ├── src/
│   │   ├── routes/     # API route handlers
│   │   ├── services/   # Business logic
│   │   └── lib/        # Utility functions
├── shared/             # Shared code between frontend and backend
│   ├── schema.ts      # Database schema definitions
│   └── types/         # Shared TypeScript types
├── migrations/        # Database migrations
└── supabase/         # Supabase configurations and functions
```

## 🔧 Technical Architecture

### Database Schema
- Uses Drizzle ORM with PostgreSQL
- UUID-based primary keys for all user-related tables
- Strict foreign key relationships
- Proper indexing for performance

### Authentication Flow
1. Wallet Connection (Phantom, etc.)
2. Public key verification
3. Profile creation/verification
4. Session management via Supabase

### State Management
- React Context for global state
- TanStack Query for server state
- Local storage for persistent data

## 🛡️ Best Practices

### Database
- Always use UUIDs for user-related primary keys
- Include created_at and updated_at timestamps
- Add appropriate indexes for frequently queried columns
- Use proper foreign key constraints

### Authentication
- Always verify wallet signatures
- Store auth_provider_id for wallet addresses
- Handle wallet disconnection gracefully
- Implement proper session management

### API Development
- Use TypeScript for type safety
- Implement proper error handling
- Follow RESTful conventions
- Document all endpoints

### Frontend Development
- Use TypeScript strictly
- Follow component composition patterns
- Implement proper error boundaries
- Use proper loading states

## 🎯 Core Features

### 🐱 Lucky Cat Fortune System
- Interactive Lucky Cat animation for daily fortune pulls
- Multiple prize tiers: daily, weekly, monthly, and yearly draws
- Unique fortune messages and crypto rewards
- Ticket collection system for different prize tiers

### 💰 Rewards & Tokenomics
- Win SOL and CTH tokens through various prize draws
- Native CTH token with deflationary mechanics
- Staking rewards for passive income
- NFT collections with unique Lucky Cat designs (coming soon)

### 👛 Wallet Integration
- Seamless Solana wallet connection
- Support for major wallets (Phantom, Solflare, etc.)
- Secure authentication using wallet signatures
- Real-time balance and transaction tracking

### 🏆 Community Features
- Live winners board showcasing recent prize winners
- User dashboard for tracking tickets and rewards
- Community leaderboards and statistics
- Referral program for bonus rewards

## 💡 How It Works

1. **Daily Fortune Pull**
   - Connect your wallet
   - Pull the Lucky Cat's paw
   - Receive your fortune and potential rewards
   - Collect tickets for prize draws

2. **Prize Draws**
   - Daily: Small SOL prizes
   - Weekly: Medium SOL prizes
   - Monthly: Large SOL prizes
   - Yearly: Major SOL jackpots

3. **Rewards System**
   - Win SOL directly from prize draws
   - Earn CTH tokens through various activities
   - Stake CTH for passive income
   - Collect NFTs for additional benefits

## 🛠️ Technical Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn UI for components
- TanStack Query for data fetching
- Solana Web3.js for blockchain interaction

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Supabase for auth and storage
- WebSocket for real-time updates

### Testing
- Vitest for unit testing
- Playwright for E2E testing
- MSW for API mocking

### Infrastructure
- Vercel for frontend deployment
- Supabase for database and auth
- GitHub Actions for CI/CD

## 🔍 Common Issues & Solutions

### Database Migration Issues
- Always check schema.ts for proper types
- Use consistent ID types (UUID)
- Run migrations in development first
- Backup data before migrations

### Wallet Connection Issues
- Check for proper RPC endpoints
- Verify wallet adapter configuration
- Handle network changes
- Implement proper error handling

### Authentication Issues
- Verify Supabase configuration
- Check auth_provider_id column
- Handle session expiration
- Implement proper error messages

### Common HTTP Error Codes

#### 406 Not Acceptable
- **Cause**: Supabase API request headers not properly configured
- **Solution**: 
  ```typescript
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  ```

#### 400 Bad Request
- **Cause**: Invalid request format or missing required fields
- **Common Scenarios**:
  - Profile picture upload failing
  - Invalid UUID format
  - Missing required fields in request body
- **Solution**: 
  - Verify request payload structure
  - Check file upload format and size
  - Ensure all required fields are present

#### 500 Internal Server Error
- **Common Scenarios**:
  - API endpoints failing (/api/draws/upcoming)
  - User activities endpoint failing
  - Ticket queries failing
- **Solution**:
  1. Check server logs for detailed error messages
  2. Verify database connection
  3. Ensure proper error handling in API routes
  4. Check for missing environment variables

### Storage Issues
- **Profile Picture Upload Failures**:
  - Verify storage bucket permissions
  - Check file size limits
  - Ensure proper file type validation
  - Verify storage bucket exists in Supabase

### API Endpoint Troubleshooting

#### User Activities Endpoint
```typescript
// Example of proper error handling
app.get('/api/user/:userId/activities', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === '0') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    // ... rest of the handler
  } catch (error) {
    console.error('Activities endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Ticket Queries
```typescript
// Example of proper ticket query handling
app.get('/api/user/:userId/tickets', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === '0') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    // ... rest of the handler
  } catch (error) {
    console.error('Tickets endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Development Environment Setup

#### Required Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url

# Solana Configuration
VITE_SOLANA_RPC_URL=your_solana_rpc_url
VITE_SOLANA_NETWORK=devnet  # or mainnet-beta

# Storage Configuration
VITE_STORAGE_URL=your_storage_url
VITE_STORAGE_KEY=your_storage_key

# API Configuration
VITE_API_URL=your_api_url
```

#### Supabase Setup Checklist
1. Create project in Supabase dashboard
2. Enable authentication providers
3. Create storage buckets:
   ```sql
   -- Run in Supabase SQL editor
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('profile-pictures', 'profile-pictures', true);
   ```
4. Set up storage policies:
   ```sql
   -- Allow authenticated users to upload profile pictures
   CREATE POLICY "Users can upload their own profile pictures"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Debugging Tips
1. Enable detailed logging:
   ```typescript
   // In your Supabase client configuration
   const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    debug: true
   });
   ```

2. Check network requests in browser dev tools
3. Verify Supabase dashboard for:
   - Authentication settings
   - Database tables and policies
   - Storage bucket configurations
   - API endpoints and functions

## 📚 Documentation

For more detailed information, please refer to:
- [Architecture Documentation](ARCHITECTURE.md)
- [Tokenomics & Roadmap](TOKENOMICS.md)

## 🗺️ Development Roadmap

### Q2 2025: Tea House Launch (Open-Alpha)
- Basic Lucky Cat fortune pulling
- Wallet authentication
- Daily prize draws
- User dashboard

### Q3 2025: Customization Build Out (Open-Beta)
- Weekly prize draws
- Enhanced animations
- New fortune types
- Mobile optimization

### Q4 2025: Ecosystem Growth (Full Release)
- Monthly prize draws
- Virtuals Agents integration
- Advanced dashboards
- Referral program

### 2026: Expansion & Growth
- Yearly draws
- Multi-chain support
- Advanced staking
- NFT collections
- DAO governance
- Mobile app

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests to our repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Connect With Us

- [Website](https://cryptoteahouse.com)
- [Twitter](https://twitter.com/cryptoteahouse)
- [Discord](https://discord.gg/cryptoteahouse)
- [Telegram](https://t.me/cryptoteahouse)

---

Built with ❤️ for the crypto community

## Authentication

Crypto Tea House now supports **only wallet-based authentication**. Users must connect a Solana-compatible wallet (such as Phantom or Solflare) to sign up and log in. All other sign-in methods (email/password, Google, Twitter, Discord) have been removed for enhanced security and simplicity.