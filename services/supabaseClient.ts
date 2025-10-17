import { createClient } from '@supabase/supabase-js';

// Using placeholder credentials to prevent the application from crashing.
// To connect to your Supabase instance, replace these placeholders with your
// actual Supabase URL and anonymous key.
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseKey = 'placeholder.anon.key';

export const supabase = createClient(supabaseUrl, supabaseKey);