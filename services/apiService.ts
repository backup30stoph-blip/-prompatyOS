import { mockPrompts, mockPosts, addPrompt, addPost, mockUsers } from './mockData';
import { Prompt, Post } from '../types';

// Helper function to simulate network delay for a more realistic feel
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getPrompts = async (): Promise<Prompt[]> => {
  await delay(200); // Simulate network latency
  // Return a copy to prevent direct mutation of mock data
  return Promise.resolve([...mockPrompts]);
};

export const getPromptsByIds = async (ids: Set<string>): Promise<Prompt[]> => {
  await delay(200);
  const idArray = Array.from(ids);
  return Promise.resolve(mockPrompts.filter(p => idArray.includes(p.id)));
};

export const getPosts = async (): Promise<Post[]> => {
  await delay(200);
  return Promise.resolve([...mockPosts]);
};

export const getPromptById = async (id: string): Promise<Prompt | undefined> => {
  await delay(200);
  const prompt = mockPrompts.find(p => p.id === id);
  return Promise.resolve(prompt);
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  await delay(200);
  const post = mockPosts.find(p => p.slug === slug);
  return Promise.resolve(post);
};

export const incrementPostViewCount = async (slug: string): Promise<void> => {
  await delay(50); // Short delay for a quick background task
  const postIndex = mockPosts.findIndex(p => p.slug === slug);
  if (postIndex !== -1) {
    mockPosts[postIndex].views += 1;
  }
  return Promise.resolve();
};

export const addPromptToDb = async (promptData: any): Promise<Prompt> => {
  await delay(500);
  // Use the first mock user as the author for simplicity
  const author = mockUsers[0];
  const newPrompt: Prompt = {
    id: `prompt-${Date.now()}`,
    ...promptData,
    author: author,
    created_at: new Date().toISOString(),
    likes: 0,
    views: 0,
    verified: false, // New prompts are unverified by default
  };
  addPrompt(newPrompt); // Use the imported function to add to the mock array
  return Promise.resolve(newPrompt);
};

export const addPostToDb = async (postData: Omit<Post, 'id' | 'published_at' | 'author' | 'views' | 'comments_count' | 'is_trending'> & { author_id: string }): Promise<Post> => {
  await delay(500);
  const author = mockUsers.find(u => u.id === postData.author_id) || mockUsers[0];
  const newPost: Post = {
    id: `post-${Date.now()}`,
    ...postData,
    author: author,
    published_at: new Date().toISOString(),
    views: 0,
    comments_count: 0,
    is_trending: false,
  };
  addPost(newPost); // Use the imported function to add to the mock array
  return Promise.resolve(newPost);
};

export const validateSlugUniqueness = async (slug: string): Promise<boolean> => {
  await delay(100);
  const isUnique = !mockPrompts.some(p => p.slug === slug);
  return Promise.resolve(isUnique);
};

export const getUniqueSlugSuggestion = async (slug: string): Promise<string> => {
  await delay(100);
  // Simple suggestion logic for the mock environment
  return Promise.resolve(`${slug}-${Math.floor(Math.random() * 1000)}`);
};

export const getRelatedPrompts = async (currentPrompt: Prompt): Promise<Prompt[]> => {
  await delay(300); // Simulate network latency for this specific call

  const candidates = mockPrompts.filter(p => 
    p.id !== currentPrompt.id && p.category === currentPrompt.category
  );

  const scoredCandidates = candidates.map(p => {
    const commonTags = p.tags.filter(tag => currentPrompt.tags.includes(tag)).length;
    return { prompt: p, score: commonTags };
  });

  // Sort by score (common tags), then by likes as a tie-breaker
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.prompt.likes - a.prompt.likes;
  });

  // Return the top 4 prompts
  return scoredCandidates.slice(0, 4).map(item => item.prompt);
};