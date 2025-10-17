import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, incrementPostViewCount } from '../services/apiService';
import { Post } from '../types';
import AdsenseAd from '../components/AdsenseAd';
import Card from '../components/ui/Card';
import { Loader2Icon, CalendarIcon, EditIcon, ShareIcon, EyeIcon } from '../components/icons';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useToast } from '../contexts/ToastContext';
import PostReactions from '../components/PostReactions';

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
  const { addToast } = useToast();
  
  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPostBySlug(slug);
            if (data) {
                setPost(data);
                // Increment the view count in the background
                await incrementPostViewCount(slug);
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

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: `ألق نظرة على هذا المقال على برمباتي: "${post.title}"`,
      url: window.location.href,
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
      navigator.clipboard.writeText(window.location.href);
      addToast('تم نسخ الرابط! يمكنك الآن لصقه ومشاركته.', 'success');
    }
  };


  if (loading) {
    return <div className="flex justify-center py-20"><Loader2Icon className="w-10 h-10 animate-spin text-slate-400" /></div>;
  }
  
  if (error || !post) {
    return <div className="text-center text-slate-800 text-2xl py-20">{error}</div>;
  }

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المدونة', href: '/blog' },
    { label: post.title },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
        <div className="my-8">
            <AdsenseAd type="display" />
        </div>

        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <Card className="p-6 md:p-12">
            <header className="mb-8 border-b border-slate-200 pb-8">
                {post.tags.length > 0 && (
                  <Link to={`/blog?search=${post.tags[0]}`} className="inline-block mb-4">
                      <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                          {post.tags[0]}
                      </span>
                  </Link>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{post.title}</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center text-base text-slate-600">
                      <div className="flex items-center gap-3">
                          <img src={post.author.avatar_url} alt={post.author.username} className="w-10 h-10 rounded-full" />
                          <div>
                              <span className="font-semibold text-slate-800">{post.author.username}</span>
                              <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <div className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                                    <span>نشر في: {new Date(post.published_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                {post.updated_at && new Date(post.updated_at).getTime() > new Date(post.published_at).getTime() && (
                                  <div className="flex items-center gap-1.5">
                                    <EditIcon className="w-4 h-4 text-slate-400" />
                                    <span>آخر تحديث: {new Date(post.updated_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <EyeIcon className="w-4 h-4 text-slate-400" />
                                    <span>{post.views.toLocaleString('ar-EG')} مشاهدة</span>
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
                   <div className="flex-shrink-0 w-full sm:w-auto flex gap-2">
                      <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 transition-colors py-2 px-4 rounded-lg font-semibold border text-slate-700 bg-white hover:bg-slate-100 border-slate-300">
                        <ShareIcon className="w-5 h-5" />
                        <span>مشاركة</span>
                      </button>
                  </div>
                </div>
            </header>
            
            <div className="my-8">
                <AdsenseAd type="article" />
            </div>

            <article className="prose prose-lg prose-p:text-slate-700 max-w-none prose-headings:text-slate-900 prose-strong:text-slate-900">
                <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
            </article>
            
            <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">ما هو رد فعلك؟</h3>
                <PostReactions postId={post.id} initialReactions={post.reactions} />
            </div>


            {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">العلامات</h3>
                    <div className="flex flex-wrap gap-3">
                        {post.tags.map(tag => (
                            <Link key={tag} to={`/blog?search=${tag}`} className="text-sm bg-slate-100 text-slate-800 px-4 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12">
                <AdsenseAd type="article" />
            </div>
        </Card>
    </div>
  );
};

export default BlogPostPage;