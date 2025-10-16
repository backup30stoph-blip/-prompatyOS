
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPromptById } from '../services/apiService';
import { Prompt, promptCategoryTranslations } from '../types';
import Button from '../components/ui/Button';
import { usePromptLike } from '../hooks/usePromptLike';
import { HeartIcon, Loader2Icon, CopyIcon, CheckCircleIcon } from '../components/icons';
import AdsenseAd from '../components/AdsenseAd';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useToast } from '../contexts/ToastContext';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState('نسخ الأمر');
  const { addToast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
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

  const { isLiked, likeCount, toggleLike } = usePromptLike(
    prompt?.id || '',
    prompt?.likes || 0
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2Icon className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }
  
  if (error || !prompt) {
    return <div className="text-center text-[#1C2B3A] text-2xl py-20">{error}</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopyText('تم النسخ!');
    addToast('تم نسخ الأمر بنجاح!', 'success');
    setTimeout(() => setCopyText('نسخ الأمر'), 2000);
  };
  
  const categoryColors: Record<string, { bg: string; text: string }> = {
    TEXT: { bg: 'bg-blue-50', text: 'text-blue-700' },
    IMAGE: { bg: 'bg-purple-50', text: 'text-purple-700' },
    VIDEO: { bg: 'bg-pink-50', text: 'text-pink-700' },
    CODE: { bg: 'bg-green-50', text: 'text-green-700' },
    WRITING: { bg: 'bg-orange-50', text: 'text-orange-700' },
    BUSINESS: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    ART: { bg: 'bg-red-50', text: 'text-red-700' },
    DESIGN: { bg: 'bg-teal-50', text: 'text-teal-700' },
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2B3A]">{prompt.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
                <img src={prompt.author.avatar_url} alt={prompt.author.username} className="w-8 h-8 rounded-full" />
                <span className="font-semibold">{prompt.author.username}</span>
            </div>
            <span>&middot;</span>
            <span>{new Date(prompt.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      <div className="bg-white border border-gray-200/80 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-[#1C2B3A] mb-5">نص الأمر</h2>

        <div className="mb-6">
          <AdsenseAd type="article" />
        </div>

        <div className="bg-gray-900 text-gray-200 p-5 rounded-lg mb-6 font-mono text-base leading-relaxed whitespace-pre-wrap">
            {prompt.prompt_text}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handleCopy} className="w-full sm:w-auto !py-3">
                <CopyIcon className="w-5 h-5 me-2" />
                {copyText}
            </Button>
            <button
                onClick={toggleLike}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 transition-colors py-3 px-6 rounded-lg font-semibold border ${
                isLiked 
                    ? 'text-[#D72323] bg-red-50 border-red-200' 
                    : 'text-gray-700 bg-white hover:bg-gray-100 border-gray-300'
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
            <h3 className="text-xl font-bold text-[#1C2B3A] mb-4">العلامات</h3>
            <div className="flex flex-wrap gap-3">
            {prompt.tags.map(tag => (
                <Link key={tag} to={`/prompts?search=${tag}`} className="text-sm bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-300 transition-colors">
                #{tag}
                </Link>
            ))}
            </div>
      </div>
      )}

      <div className="my-8">
          <AdsenseAd type="display" />
      </div>
    </div>
  );
};

export default PromptDetailPage;