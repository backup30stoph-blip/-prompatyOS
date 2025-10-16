import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dseaxuoybveharsxxvnd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZWF4dW95YnZlaGFyc3h4dm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTY3ODIsImV4cCI6MjA3NjEzMjc4Mn0.KI9gGb7b_SSAw7DZBMgAo0mfyenzueN9trL893mEkH8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
