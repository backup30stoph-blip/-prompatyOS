import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import Card from './ui/Card';
import {
  ShareIcon,
  EyeIcon
} from './icons';
import { useToast } from '../contexts/ToastContext';
import PostReactions from './PostReactions';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { addToast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: post.title,
      text: `ألق نظرة على هذا المقال على برمباتي: "${post.title}"`,
      url: `${window.location.origin}/#/blog/${post.slug}`, // Hash router requires manual path construction
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          addToast('لم تتم المشاركة، حدث خطأ.', 'error');
        }
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      addToast('تم نسخ الرابط! يمكنك الآن لصقه ومشاركته.', 'success');
    }
  };


  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="block group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-xl"
    >
      <Card className="h-full flex flex-col overflow-hidden">
        {post.featured_image && (
          <div className="aspect-video bg-slate-100 overflow-hidden">
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
                  <span key={index} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      #{tag}
                  </span>
              ))}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 flex-grow">
              <img src={post.author.avatar_url} alt={post.author.username} className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-slate-700">{post.author.username}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-100 mt-auto">
            <PostReactions postId={post.id} initialReactions={post.reactions} />
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5" title="المشاهدات">
                <EyeIcon className="w-4 h-4" />
                <span>{post.views.toLocaleString('ar-EG')}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 transition-colors text-slate-600 hover:text-orange-600"
                aria-label="Share Post"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogPostCard;