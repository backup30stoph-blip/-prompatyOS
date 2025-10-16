import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import Card from './ui/Card';
import {
  ClockIcon,
  EyeIcon,
  BookmarkIcon,
  ShareIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftIcon
} from './icons';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="block group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-xl"
    >
      <Card className="h-full flex flex-col overflow-hidden">
        {post.featured_image && (
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#205295]/10 text-[#205295]">
                      #{tag}
                  </span>
              ))}
          </div>
          <h3 className="text-xl font-bold text-[#1C2B3A] mb-3 line-clamp-2 group-hover:text-[#0A2647] transition-colors flex-grow">
            {post.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar_url} alt={post.author.username} className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-[#344054]">{post.author.username}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogPostCard;