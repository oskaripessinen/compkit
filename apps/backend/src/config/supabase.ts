import { createClient } from '@supabase/supabase-js';
import { config } from './env';

if (!config.supabase?.url || !config.supabase?.serviceKey) {
  throw new Error('Supabase URL and Service Key must be configured in environment variables');
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Type definitions for database tables
export type Database = {
  public: {
    Tables: {
      components: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string | null;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string | null;
          code?: string;
          created_at?: string;
        };
      };
      libraries: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      library_components: {
        Row: {
          library_id: string;
          component_id: string;
        };
        Insert: {
          library_id: string;
          component_id: string;
        };
        Update: {
          library_id?: string;
          component_id?: string;
        };
      };
    };
  };
};