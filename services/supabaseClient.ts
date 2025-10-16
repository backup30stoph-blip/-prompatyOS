import { createClient } from '@supabase/supabase-js';

// FIX: Removed vite/client reference that was causing an error, and
// cast `import.meta` to `any` to access environment variables without TypeScript errors.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);