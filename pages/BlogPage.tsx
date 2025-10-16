import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/apiService';
import { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import { Loader2Icon } from '../components/icons';
import AdsenseAd from '../components/AdsenseAd';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to load blog posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-[#1C2B3A]">المدونة</h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">مقالات ونصائح وتقارير حول عالم الذكاء الاصطناعي وهندسة الأوامر.</p>
      </header>

      <div className="my-8">
        <AdsenseAd type="display" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2Icon className="w-10 h-10 text-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;