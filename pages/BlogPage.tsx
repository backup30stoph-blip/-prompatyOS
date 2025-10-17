import React, { useState, useEffect, useMemo } from 'react';
import { getPosts } from '../services/apiService';
import { Post } from '../types';
import BlogPostCard from '../components/BlogPostCard';
import { Loader2Icon, SearchIcon } from '../components/icons';
import AdsenseAd from '../components/AdsenseAd';
import { useSearch } from '../contexts/SearchContext';
import Input from '../components/ui/Input';
import { useDebounce } from '../hooks/useDebounce';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearch, 500);

  // Sync local search with global term
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Update global term from local debounced term
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);


  // Clear search term when the component is unmounted
  useEffect(() => {
    return () => {
      setSearchTerm('');
    };
  }, [setSearchTerm]);

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

  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return posts;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, posts]);


  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-slate-900">المدونة</h1>
        <p className="text-lg text-slate-700 mt-4 max-w-2xl mx-auto">مقالات ونصائح وتقارير حول عالم الذكاء الاصطناعي وهندسة الأوامر.</p>
      </header>
      
      {/* Search Bar Section is now handled by the global Navbar */}

      <div className="my-8">
        <AdsenseAd type="display" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2Icon className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-lg">
            <p>لم يتم العثور على مقالات تطابق بحثك.</p>
          </div>
        )
      )}
    </div>
  );
};

export default BlogPage;