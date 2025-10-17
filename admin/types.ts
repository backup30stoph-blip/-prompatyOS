export interface User {
  id: string;
  username: string;
}

export interface Prompt {
  id: string;
  title: string;
  category: string;
  author: User;
  created_at: string;
  verified: boolean;
}

export interface Post {
  id: string;
  title: string;
  author: User;
  tags: string[];
  published_at: string;
}
