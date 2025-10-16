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
  return data || [];
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
  return data;
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
