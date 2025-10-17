import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPromptById, getRelatedPrompts } from '../services/apiService';
import { Prompt, promptCategoryTranslations } from '../types';
import Button from '../components/ui/Button';
import { usePromptLike } from '../hooks/usePromptLike';
import { HeartIcon, Loader2Icon, CopyIcon, CheckCircleIcon, ShareIcon } from '../components/icons';
import AdsenseAd from '../components/AdsenseAd';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useToast } from '../contexts/ToastContext';
import PromptCard from '../components/PromptCard';
import PromptCardSkeleton from '../components/PromptCardSkeleton';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState('نسخ الأمر');
  const { addToast } = useToast();
  
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        // Reset related prompts when fetching a new main prompt
        setRelatedPrompts([]); 
        const data = await getPromptById(id);
        if (data) {
          setPrompt(data);
        } else {
          setError('لم يتم العثور على الأمر.');
        }
      } catch (err) {
        setError('فشل في تحميل الأمر.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id]);

  useEffect(() => {
    if (!prompt) return;

    const fetchRelated = async () => {
        try {
            setRelatedLoading(true);
            const data = await getRelatedPrompts(prompt);
            setRelatedPrompts(data);
        } catch (err) {
            console.error("Failed to fetch related prompts", err);
        } finally {
            setRelatedLoading(false);
        }
    };

    fetchRelated();
  }, [prompt]);

  const { isLiked, likeCount, toggleLike } = usePromptLike(
    prompt?.id || '',
    prompt?.likes || 0
  );

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopyText('تم النسخ!');
    addToast('تم نسخ الأمر بنجاح!', 'success');
    setTimeout(() => setCopyText('نسخ الأمر'), 2000);
  };
  
  const handleShare = async () => {
    if (!prompt) return;

    const shareData = {
      title: prompt.title,
      text: `ألق نظرة على هذا الأمر للذكاء الاصطناعي على برمباتي: "${prompt.title}"`,
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
  
  if (error || !prompt) {
    return <div className="text-center text-slate-800 text-2xl py-20">{error}</div>;
  }
  
  const categoryColors: Record<string, { bg: string; text: string }> = {
    TEXT: { bg: 'bg-orange-50', text: 'text-orange-700' },
    IMAGE: { bg: 'bg-amber-50', text: 'text-amber-700' },
    VIDEO: { bg: 'bg-red-50', text: 'text-red-700' },
    CODE: { bg: 'bg-lime-50', text: 'text-lime-700' },
    WRITING: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    BUSINESS: { bg: 'bg-sky-50', text: 'text-sky-700' },
    ART: { bg: 'bg-rose-50', text: 'text-rose-700' },
    DESIGN: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  };
  const colors = categoryColors[prompt.category] || categoryColors.TEXT;

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الأوامر', href: '/prompts' },
    { label: promptCategoryTranslations[prompt.category], href: `/prompts?category=${prompt.category}` },
    { label: prompt.title },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AdsenseAd type="display" />

      <Breadcrumb items={breadcrumbItems} />

      <header className="space-y-4">
        <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${colors.bg} ${colors.text}`}>
                {promptCategoryTranslations[prompt.category]}
            </span>
            {prompt.verified && (
                <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">أمر موثق</span>
                </div>
            )}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">{prompt.title}</h1>
        <div className="flex items-center gap-4 text-slate-600">
            <div className="flex items-center gap-2">
                <img src={prompt.author.avatar_url} alt={prompt.author.username} className="w-8 h-8 rounded-full" />
                <span className="font-semibold">{prompt.author.username}</span>
            </div>
            <span>&middot;</span>
            <span>{new Date(prompt.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-5">نص الأمر</h2>

        <div className="mb-6">
          <AdsenseAd type="article" />
        </div>

        <div className="bg-slate-900 text-slate-200 p-5 rounded-lg mb-6 font-mono text-base leading-relaxed whitespace-pre-wrap">
            {prompt.prompt_text}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handleCopy} className="w-full sm:w-auto !py-3">
                <CopyIcon className="w-5 h-5 me-2" />
                {copyText}
            </Button>
             <Button onClick={handleShare} variant="secondary" className="w-full sm:w-auto !py-3 bg-white border-slate-300">
                <ShareIcon className="w-5 h-5 me-2" />
                مشاركة
            </Button>
            <button
                onClick={toggleLike}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-colors py-3 px-6 rounded-lg font-semibold border ${
                isLiked 
                    ? 'text-red-600 bg-red-50 border-red-200' 
                    : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-300'
                }`}
                aria-label="Like prompt"
            >
                <HeartIcon filled={isLiked} className="w-5 h-5" />
                <span>{likeCount}</span>
            </button>
        </div>
      </div>

      {prompt.tags.length > 0 && (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">العلامات</h3>
            <div className="flex flex-wrap gap-3">
            {prompt.tags.map(tag => (
                <Link key={tag} to={`/prompts?search=${tag}`} className="text-sm bg-slate-200 text-slate-800 px-4 py-1.5 rounded-full hover:bg-slate-300 transition-colors">
                #{tag}
                </Link>
            ))}
            </div>
      </div>
      )}

      {(relatedLoading || relatedPrompts.length > 0) && (
        <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">أوامر مشابهة</h2>
            {relatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <PromptCardSkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPrompts.map(relatedPrompt => (
                        <PromptCard key={relatedPrompt.id} prompt={relatedPrompt} />
                    ))}
                </div>
            )}
        </section>
      )}

      <div className="my-8">
          <AdsenseAd type="display" />
      </div>
    </div>
  );
};

export default PromptDetailPage;