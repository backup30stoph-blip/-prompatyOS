import { mockPrompts, mockPosts, addPrompt, addPost, mockUsers } from './mockData';
import { Prompt, Post } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getPrompts = async (): Promise<Prompt[]> => {
  await delay(300);
  // Return a copy to avoid direct mutation of mock data
  return [...mockPrompts];
};

export const getPromptsByIds = async (ids: Set<string>): Promise<Prompt[]> => {
  await delay(200);
  // This simulates a more efficient database query for fetching specific items.
  return mockPrompts.filter(p => ids.has(p.id));
};

export const getPosts = async (): Promise<Post[]> => {
  await delay(300);
  return [...mockPosts];
};

export const getPromptById = async (id: string): Promise<Prompt | undefined> => {
  await delay(200);
  return mockPrompts.find(p => p.id === id);
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  await delay(200);
  return mockPosts.find(p => p.slug === slug);
};

export const addPromptToDb = async (promptData: any): Promise<Prompt> => {
    await delay(500);
    const author = mockUsers.find(u => u.id === promptData.author_id) || mockUsers[0];
    const newPrompt: Prompt = {
        id: `prompt-${Date.now()}`,
        created_at: new Date().toISOString(),
        author: author,
        likes: 0,
        views: 0,
        ...promptData,
        level: promptData.level,
        language: promptData.language
    };
    addPrompt(newPrompt);
    return newPrompt;
};

export const addPostToDb = async (postData: Omit<Post, 'id' | 'published_at' | 'author' | 'views' | 'comments_count' | 'is_trending'> & { author_id: string }): Promise<Post> => {
    await delay(500);
    const author = mockUsers.find(u => u.id === postData.author_id) || mockUsers[0];
    const newPost: Post = {
        id: `post-${Date.now()}`,
        published_at: new Date().toISOString(),
        author: author,
        views: 0,
        comments_count: 0,
        is_trending: false,
        ...postData
    };
    addPost(newPost);
    return newPost;
};

export const validateSlugUniqueness = async (slug: string): Promise<boolean> => {
    await delay(150);
    // This simulates a check against a database using the mock data.
    return !mockPrompts.some(p => p.slug === slug);
};

export const getUniqueSlugSuggestion = async (slug: string): Promise<string> => {
    await delay(100);
    return `${slug}-${Math.floor(Math.random() * 1000)}`;
};