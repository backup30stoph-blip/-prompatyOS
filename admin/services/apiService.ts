import { supabase } from './supabaseClient';
import { Prompt } from '../types';

export const getAdminPrompts = async (): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('id, title, category, created_at, verified, author:author_id(id, username)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
  // FIX: The type error indicates Supabase returns the related author as an array.
  // We map the data to extract the first author object and filter out any prompts
  // where an author might be missing to ensure type compatibility with `Prompt[]`.
  return (data || [])
    .map((p: any) => ({ ...p, author: p.author?.[0] }))
    .filter(p => p.author) as Prompt[];
};

export const updatePromptVerification = async (id: string, verified: boolean): Promise<Prompt> => {
  const { data, error } = await supabase
    .from('prompts')
    .update({ verified })
    .eq('id', id)
    .select('id, title, category, created_at, verified, author:author_id(id, username)')
    .single();

  if (error) {
    console.error('Error updating prompt verification:', error);
    throw error;
  }
  if (!data) throw new Error("Prompt not found after update.");
  
  // FIX: The type error indicates Supabase returns the related author as an array.
  // We transform the data to extract the first author object to match the `Prompt` type.
  const promptData: any = data;
  if (!promptData.author?.[0]) {
    throw new Error('Author not found for the prompt after update.');
  }

  return {
    ...promptData,
    author: promptData.author[0],
  };
};

export const deletePromptById = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting prompt:', error);
    throw error;
  }
};