// import { createClient } from '@supabase/supabase-js';

// This file has been updated to resolve an environment variable error.
// All Supabase functionality has been temporarily disabled as requested.
// The application now relies on mock data for its data layer.

/*
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided as environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

// Exporting a null object to satisfy the module system, as this file is no longer used.
export const supabase = null;
