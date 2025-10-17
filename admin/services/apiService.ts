import { mockPrompts, mockPosts } from '../../services/mockData';
import { Post, Prompt } from '../types';

// Create a session-specific copy of the mock data so that admin actions
// like deleting/verifying are reflected during the session.
let sessionMockPrompts = [...mockPrompts];
let sessionMockPosts = [...mockPosts];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getAdminPrompts = async (): Promise<Prompt[]> => {
  await delay(200);
  // Map the full prompt data to the simpler type used in the admin panel.
  const adminPrompts: Prompt[] = sessionMockPrompts.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      author: {
          id: p.author.id,
          username: p.author.username,
      },
      created_at: p.created_at,
      verified: p.verified || false,
  }));
  return Promise.resolve(adminPrompts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
};

export const updatePromptVerification = async (id: string, verified: boolean): Promise<Prompt> => {
  await delay(100);
  const promptIndex = sessionMockPrompts.findIndex(p => p.id === id);
  if (promptIndex === -1) {
      throw new Error("Prompt not found");
  }
  
  const originalPrompt = sessionMockPrompts[promptIndex];
  originalPrompt.verified = verified;
  
  const updatedAdminPrompt: Prompt = {
      id: originalPrompt.id,
      title: originalPrompt.title,
      category: originalPrompt.category,
      author: {
          id: originalPrompt.author.id,
          username: originalPrompt.author.username,
      },
      created_at: originalPrompt.created_at,
      verified: originalPrompt.verified,
  };

  return Promise.resolve(updatedAdminPrompt);
};

export const deletePromptById = async (id: string): Promise<void> => {
  await delay(100);
  const promptIndex = sessionMockPrompts.findIndex(p => p.id === id);
  if (promptIndex > -1) {
      sessionMockPrompts.splice(promptIndex, 1);
  } else {
      console.warn("Prompt to delete was not found");
  }
  return Promise.resolve();
};

export const getAdminPosts = async (): Promise<Post[]> => {
  await delay(200);
  const adminPosts: Post[] = sessionMockPosts.map(p => ({
    id: p.id,
    title: p.title,
    author: {
      id: p.author.id,
      username: p.author.username,
    },
    tags: p.tags,
    published_at: p.published_at,
  }));
  return Promise.resolve(adminPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()));
};

export const deletePostById = async (id: string): Promise<void> => {
  await delay(100);
  const postIndex = sessionMockPosts.findIndex(p => p.id === id);
  if (postIndex > -1) {
    sessionMockPosts.splice(postIndex, 1);
  } else {
    console.warn("Post to delete was not found");
  }
  return Promise.resolve();
};