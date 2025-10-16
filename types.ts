
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
  featured_image: string;
  is_trending: boolean;
  tags: string[];
  views: number;
  comments_count: number;
}
