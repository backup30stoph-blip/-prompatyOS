import React, { useState, useEffect } from 'react';
import PromptCard from '../components/PromptCard';
import { LIKED_PROMPTS_KEY } from '../hooks/usePromptLike';
import { getPromptsByIds } from '../services/apiService';
import { Prompt } from '../types';
import { Loader2Icon } from '../components/icons';

const LikedPromptsPage: React.FC = () => {
  const [likedPrompts, setLikedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedPrompts = async () => {
      try {
        setLoading(true);
        setError(null);
        const likedPromptIds = new Set<string>(JSON.parse(localStorage.getItem(LIKED_PROMPTS_KEY) || '[]'));
        if (likedPromptIds.size > 0) {
          const likedPromptsData = await getPromptsByIds(likedPromptIds);
          setLikedPrompts(likedPromptsData);
        } else {
          setLikedPrompts([]);
        }
      } catch (err) {
        setError("Failed to fetch liked prompts.");
        console.error("Failed to fetch liked prompts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedPrompts();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#303841]">الأوامر المعجب بها</h1>
        <p className="text-gray-600 mt-2">
          هنا تجد جميع الأوامر التي أبديت إعجابك بها.
        </p>
      </header>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
         <div className="text-center py-16 text-red-600">{error}</div>
      ) : likedPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-600 bg-white border border-gray-200 rounded-lg">
            <p>لم تعجب بأي أوامر بعد.</p>
        </div>
      )}
    </div>
  );
};

export default LikedPromptsPage;