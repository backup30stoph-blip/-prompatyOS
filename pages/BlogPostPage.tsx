

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/apiService';
import { Post } from '../types';
import AdsenseAd from '../components/AdsenseAd';
import Card from '../components/ui/Card';
import { Loader2Icon } from '../components/icons';

const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
  let element = document.querySelector(`meta[${attr}='${value}']`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
  return element;
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPostBySlug(slug);
            if (data) {
                setPost(data);
            } else {
                setError('لم يتم العثور على المقال.');
            }
        } catch (err) {
            setError('فشل في تحميل المقال.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchPost();
  }, [slug]);

  const getExcerpt = (html: string, length: number = 160): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const content = div.textContent || div.innerText || '';
    if (content.length <= length) return content;
    return content.substring(0, length).trimEnd() + '...';
  };

  useEffect(() => {
    if (post) {
      const originalTitle = document.title;
      const description = getExcerpt(post.content_html);
      const imageUrl = post.featured_image || window.location.origin + '/vite.svg';
      const pageUrl = window.location.href;

      document.title = `${post.title} | برمباتي`;

      const tagsToSet = [
        setMetaTag('name', 'description', description),
        setMetaTag('property', 'og:title', post.title),
        setMetaTag('property', 'og:description', description),
        setMetaTag('property', 'og:url', pageUrl),
        setMetaTag('property', 'og:image', imageUrl),
        setMetaTag('property', 'og:type', 'article'),
        setMetaTag('name', 'twitter:card', 'summary_large_image'),
        setMetaTag('name', 'twitter:title', post.title),
        setMetaTag('name', 'twitter:description', description),
        setMetaTag('name', 'twitter:image', imageUrl),
      ];
      
      return () => {
        document.title = originalTitle;
        tagsToSet.forEach(tag => tag.remove());
      };
    }
  }, [post]);


  if (loading) {
    return <div className="flex justify-center py-20"><Loader2Icon className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }
  
  if (error || !post) {
    return <div className="text-center text-[#1C2B3A] text-2xl py-20">{error}</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
        <div className="my-8">
            <AdsenseAd type="display" />
        </div>
        <Card className="p-6 md:p-12">
            <header className="mb-8 border-b border-gray-200 pb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1C2B3A] mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center text-base text-gray-600">
                <div className="flex items-center gap-3">
                    <img src={post.author.avatar_url} alt={post.author.username} className="w-10 h-10 rounded-full" />
                    <div>
                        <span className="font-semibold text-gray-800">{post.author.username}</span>
                        <span className="block text-sm">{new Date(post.published_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                </div>
            </header>
            
            <div className="my-8">
                <AdsenseAd type="article" />
            </div>

            <article className="prose prose-lg prose-p:text-gray-700 max-w-none prose-headings:text-[#1C2B3A] prose-strong:text-[#1C2B3A]">
                <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
            </article>

            <div className="mt-12">
                <AdsenseAd type="article" />
            </div>
        </Card>
    </div>
  );
};

export default BlogPostPage;