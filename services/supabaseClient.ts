// FIX: Removed reference to 'vite/client' which was causing a type error.
// The use of `(import.meta as any)` below bypasses the need for these types at compile time.

import { createClient } from '@supabase/supabase-js';

// FIX: Cast `import.meta` to `any` to access `env` without TypeScript errors,
// as the required 'vite/client' types were not being found.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and anonymous key must be defined in your .env file");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
