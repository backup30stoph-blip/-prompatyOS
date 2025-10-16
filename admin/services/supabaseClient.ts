import { createClient } from '@supabase/supabase-js';

// IMPORTANT: You must create a .env file in the root of your project
// and add your Supabase credentials for this to work.
// Example .env file:
// VITE_SUPABASE_URL="https://your-project-id.supabase.co"
// VITE_SUPABASE_ANON_KEY="your-public-anon-key"

// FIX: Cast `import.meta` to `any` to resolve TypeScript error about missing 'env' property.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide a better error message in the UI if possible
  console.error("Supabase URL and Anon Key are missing. Make sure to set them in your .env file.");
  // We don't throw an error here to allow the app to render a message
  // but the 'supabase' export will be null.
}

// The export is conditional to avoid crashing the app if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;