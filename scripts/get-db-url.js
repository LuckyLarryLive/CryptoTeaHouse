import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getDatabaseUrl() {
  try {
    const { data, error } = await supabase.rpc('get_database_url');
    if (error) throw error;
    console.log('Database URL:', data);
  } catch (error) {
    console.error('Error getting database URL:', error);
    process.exit(1);
  }
}

getDatabaseUrl(); 