# Crypto Tea House: Technical Architecture

## System Architecture

### Frontend

The frontend is built with React + TypeScript using Vite as the build tool. The application follows a component-based architecture with the following structure:

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── LuckyCat.tsx   # Core animation component
│   │   ├── Header.tsx     # Site-wide header
│   │   ├── Footer.tsx     # Site-wide footer
│   │   └── WalletModal.tsx # Wallet connection modal
│   │
│   ├── contexts/          # React context providers
│   │   └── WalletContext.tsx # Wallet state management
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx # Mobile detection
│   │   └── use-toast.ts   # Toast notifications
│   │
│   ├── lib/               # Utility functions and API clients
│   │   ├── queryClient.ts # TanStack Query setup
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # General utilities
│   │
│   ├── pages/             # Route components
│   │   ├── Dashboard.tsx  # User dashboard
│   │   ├── Home.tsx       # Landing page
│   │   ├── Tokenomics.tsx # Token distribution info
│   │   ├── Roadmap.tsx    # Development roadmap
│   │   ├── HowItWorks.tsx # Explainer page
│   │   └── Winners.tsx    # Recent winners display
│   │
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Shared types
│   │
│   ├── App.tsx            # App component with routes
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
```

### Backend

The backend is built with Express.js and uses PostgreSQL with Drizzle ORM:

```
server/
├── db.ts                 # Database connection
├── index.ts              # Server entry point
├── routes.ts             # API route definitions
├── storage.ts            # Data access layer
└── vite.ts               # Vite integration

shared/
└── schema.ts             # Shared TypeScript + Drizzle schema
```

### Database Schema

The application uses PostgreSQL with the following table structure:

1. `users` - User accounts linked to wallet addresses
2. `tickets` - Fortune tickets of different types (daily, weekly, monthly, yearly)
3. `draws` - Scheduled prize draws 
4. `winners` - Records of draw winners
5. `activities` - User activity log (pulls, rewards, tickets earned)

## Authentication Flow

1. User initiates wallet connection
2. Frontend requests wallet signature for authentication
3. Wallet signs a message proving ownership
4. Server validates signature and creates a session
5. User is authenticated and can interact with the application

## Fortune Pull Mechanics

1. User clicks/interacts with the Lucky Cat animation
2. Request is sent to the server
3. Server processes the pull with randomized outcome logic
4. Results are stored in the activities table
5. Response is sent to client with animation cues and rewards
6. UI updates to reflect the outcome (tickets earned, prizes won)

## Draw System

1. Scheduled draws run at predetermined intervals (daily, weekly, monthly, yearly)
2. All valid tickets for the draw period are collected
3. Winners are selected randomly with weighted probabilities based on ticket quantity
4. Winner records are created with reward information
5. Notification system alerts winners
6. Winners page is updated with recent winners

## Data Flow

1. Client makes requests via TanStack Query
2. API endpoints in Express handle requests
3. Storage layer interfaces with the database using Drizzle ORM
4. Results are returned to the client
5. React components render the UI with received data

## Wallet Integration

1. Solana Web3.js is used for blockchain interaction
2. Users connect through a range of supported wallets (Phantom, Solflare, etc.)
3. Transactions are signed on the client-side
4. Server validates transactions when needed
5. Wallet state is managed through the WalletContext

## Styling Architecture

The application uses a combination of:

1. Tailwind CSS for utility-first styling
2. Shadcn UI for component primitives
3. CSS variables for theme customization
4. Framer Motion for animations
5. Custom CSS for specialized effects

## Deployment Architecture

The application is deployed on Replit with:

1. Express server handling both API requests and serving the frontend
2. PostgreSQL database for data persistence
3. Static assets served from the build directory
4. Environment variables for configuration

This architecture provides a scalable foundation that can be extended as the application grows.