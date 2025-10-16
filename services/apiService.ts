import { supabase } from './supabaseClient';
import { Prompt, Post } from '../types';

// Helper to handle Supabase errors consistently
const handleSupabaseError = ({ error, context }: { error: any, context: string }) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    // In a real-world app, you might want to log this to an error tracking service
    throw new Error(`Supabase error in ${context}: ${error.message}`);
  }
};

export const getPrompts = async (): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*, author:author_id(*)')
    .order('created_at', { ascending: false });
  
  handleSupabaseError({ error, context: 'getPrompts' });
  return data || [];
};

export const getPromptsByIds = async (ids: Set<string>): Promise<Prompt[]> => {
  if (ids.size === 0) return [];
  const { data, error } = await supabase
    .from('prompts')
    .select('*, author:author_id(*)')
    .in('id', Array.from(ids));

  handleSupabaseError({ error, context: 'getPromptsByIds' });
  return data || [];
};

export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:author_id(*)')
    .order('published_at', { ascending: false });
    
  handleSupabaseError({ error, context: 'getPosts' });
  return data || [];
};

export const getPromptById = async (id: string): Promise<Prompt | undefined> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*, author:author_id(*)')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore 'exact one row not found'
    handleSupabaseError({ error, context: 'getPromptById' });
  }
  return data || undefined;
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:author_id(*)')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') {
     handleSupabaseError({ error, context: 'getPostBySlug' });
  }
  return data || undefined;
};

export const addPromptToDb = async (promptData: any): Promise<Prompt> => {
    const { data, error } = await supabase
        .from('prompts')
        .insert(promptData)
        .select('*, author:author_id(*)')
        .single();
    
    handleSupabaseError({ error, context: 'addPromptToDb' });
    if (!data) throw new Error('Failed to create prompt after insert.');
    return data;
};

export const addPostToDb = async (postData: Omit<Post, 'id' | 'published_at' | 'author' | 'views' | 'comments_count' | 'is_trending'> & { author_id: string }): Promise<Post> => {
    const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select('*, author:author_id(*)')
        .single();

    handleSupabaseError({ error, context: 'addPostToDb' });
    if (!data) throw new Error('Failed to create post after insert.');
    return data;
};

export const validateSlugUniqueness = async (slug: string): Promise<boolean> => {
    const { count, error } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug);
    
    if (error) {
        console.error('Error validating slug:', error);
        return false; // Fail safely
    }

    return count === 0;
};

export const getUniqueSlugSuggestion = async (slug: string): Promise<string> => {
    // This simple logic can be improved to check the DB for the suggestion's uniqueness.
    return `${slug}-${Math.floor(Math.random() * 1000)}`;
};
