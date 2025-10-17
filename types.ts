// FIX: Removed incorrect import causing a circular dependency. The User interface is defined in this file.
export interface Reactions {
  heart: number;
  insightful: number;
  funny: number;
  fire: number;
}

export type ReactionType = keyof Reactions;

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  is_premium?: boolean;
  created_at: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export enum PromptCategory {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CODE = 'CODE',
  WRITING = 'WRITING',
  BUSINESS = 'BUSINESS',
  ART = 'ART',
  DESIGN = 'DESIGN',
}

export const promptCategoryTranslations: Record<PromptCategory, string> = {
  [PromptCategory.TEXT]: 'نص',
  [PromptCategory.IMAGE]: 'صورة',
  [PromptCategory.VIDEO]: 'فيديو',
  [PromptCategory.CODE]: 'برمجة',
  [PromptCategory.WRITING]: 'كتابة',
  [PromptCategory.BUSINESS]: 'أعمال',
  [PromptCategory.ART]: 'فن',
  [PromptCategory.DESIGN]: 'تصميم',
};

export enum PromptLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export const promptLevelTranslations: Record<PromptLevel, string> = {
  // FIX: Used PromptLevel enum for keys instead of PromptCategory.
  [PromptLevel.BEGINNER]: 'مبتدئ',
  [PromptLevel.INTERMEDIATE]: 'متوسط',
  [PromptLevel.ADVANCED]: 'متقدم',
  [PromptLevel.EXPERT]: 'خبير',
};


export enum PromptLanguage {
  ARABIC = 'ARABIC',
  ENGLISH = 'ENGLISH',
  MULTILINGUAL = 'MULTILINGUAL',
}

export const promptLanguageTranslations: Record<PromptLanguage, string> = {
    [PromptLanguage.ARABIC]: 'عربي',
    [PromptLanguage.ENGLISH]: 'إنجليزي',
    [PromptLanguage.MULTILINGUAL]: 'متعدد اللغات',
};

export const promptCategoryColors: Record<PromptCategory, {
  text: string;
  hoverText: string;
  border: string;
  bg: string;
  darkerText: string;
}> = {
  [PromptCategory.TEXT]:    { text: 'text-blue-600', hoverText: 'hover:text-blue-700', border: 'border-blue-500', bg: 'bg-blue-100', darkerText: 'text-blue-800' },
  [PromptCategory.IMAGE]:   { text: 'text-purple-600', hoverText: 'hover:text-purple-700', border: 'border-purple-500', bg: 'bg-purple-100', darkerText: 'text-purple-800' },
  [PromptCategory.VIDEO]:   { text: 'text-pink-600', hoverText: 'hover:text-pink-700', border: 'border-pink-500', bg: 'bg-pink-100', darkerText: 'text-pink-800' },
  [PromptCategory.CODE]:    { text: 'text-green-600', hoverText: 'hover:text-green-700', border: 'border-green-500', bg: 'bg-green-100', darkerText: 'text-green-800' },
  [PromptCategory.WRITING]: { text: 'text-orange-600', hoverText: 'hover:text-orange-700', border: 'border-orange-500', bg: 'bg-orange-100', darkerText: 'text-orange-800' },
  [PromptCategory.BUSINESS]:{ text: 'text-indigo-600', hoverText: 'hover:text-indigo-700', border: 'border-indigo-500', bg: 'bg-indigo-100', darkerText: 'text-indigo-800' },
  [PromptCategory.ART]:     { text: 'text-red-600', hoverText: 'hover:text-red-700', border: 'border-red-500', bg: 'bg-red-100', darkerText: 'text-red-800' },
  [PromptCategory.DESIGN]:  { text: 'text-teal-600', hoverText: 'hover:text-teal-700', border: 'border-teal-500', bg: 'bg-teal-100', darkerText: 'text-teal-800' },
};

export interface Prompt {
  id: string;
  slug?: string;
  title: string;
  prompt_text: string;
  category: PromptCategory;
  level: PromptLevel;
  language: PromptLanguage;
  author: User;
  tags: string[];
  created_at: string;
  likes: number;
  views: number;
  verified?: boolean;
  examples?: string[];
  tips?: string[];
  is_ai_generated?: boolean;
  visibility?: 'public' | 'private';
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  author: User;
  published_at: string;
  updated_at?: string;
  featured_image: string;
  is_trending: boolean;
  tags: string[];
  views: number;
  comments_count: number;
  reactions: Reactions;
}