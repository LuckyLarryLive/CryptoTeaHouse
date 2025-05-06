// User types
export interface User {
  id: number;
  publicKey: string;
  lastLoginAt: string;
  createdAt: string;
}

// Ticket types
export interface Ticket {
  id: number;
  userId: number;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  quantity: number;
  createdAt: string;
}

export interface TicketCount {
  type: string;
  count: number;
}

// Draw types
export interface Draw {
  id: number;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  drawTime: string;
  status: 'pending' | 'completed';
  prize: string;
  createdAt: string;
}

export interface NextDraw {
  type: string;
  drawTime: string;
}

// Winner types
export interface Winner {
  id: number;
  userId: number;
  drawId: number;
  transactionSignature: string | null;
  prizeClaimed: boolean;
  createdAt: string;
  
  // Joined fields
  publicKey?: string;
  drawType?: string;
  prize?: string;
}

// Activity types
export interface Activity {
  id: number;
  userId: number;
  type: 'pull' | 'reward' | 'ticket_earned';
  details: {
    prize?: string;
    pullType?: string;
    message?: string;
    ticket?: Ticket;
    [key: string]: any;
  };
  createdAt: string;
}

// Pull result types
export interface PullResult {
  type: string;
  details: {
    prize?: string;
    pullType?: string;
    message: string;
    ticket?: Ticket;
  };
}

// Wallet types
export interface WalletAdapter {
  publicKey: { toString: () => string };
  isConnected: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signAndSendTransaction: (transaction: any) => Promise<string>;
}
