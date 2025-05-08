import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please check your environment variables.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Gets the Supabase URL from environment variables
 */
export function getSupabaseUrl(): string {
  return supabaseUrl;
}

/**
 * Checks if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
