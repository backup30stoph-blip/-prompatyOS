import React from 'react';
import { Link } from 'react-router-dom';
import { Prompt, promptCategoryTranslations, promptLevelTranslations } from '../types';
import Card from './ui/Card';
import { usePromptLike } from '../hooks/usePromptLike';
import { 
  HeartIcon, 
  EyeIcon, 
  CheckCircleIcon
} from './icons';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const { isLiked, likeCount, toggleLike } = usePromptLike(prompt.id, prompt.likes);

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

  return (
    <Link 
      to={`/prompts/${prompt.id}`} 
      className="block group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-xl"
    >
      <Card className="h-full flex flex-col">
          <div className="p-5 flex-grow">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="flex-grow text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {prompt.title}
                </h3>
                {prompt.verified && (
                    <div className="flex-shrink-0 text-green-600" title="موثق">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {prompt.prompt_text}
              </p>
          </div>
          <div className="p-5 border-t border-slate-100 mt-auto">
              <div className="flex items-center justify-between flex-wrap gap-y-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                            {promptCategoryTranslations[prompt.category]}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                           {promptLevelTranslations[prompt.level]}
                        </span>
                    </div>
              </div>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <img src={prompt.author.avatar_url} alt={prompt.author.username} className="w-8 h-8 rounded-full" />
                      <span className="text-sm font-semibold text-slate-700">{prompt.author.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{prompt.views || 0}</span>
                      </div>
                      <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(); }}
                          className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-600' : 'hover:text-red-600'}`}
                          aria-label="Like"
                      >
                          <HeartIcon filled={isLiked} className="w-4 h-4" />
                          <span className="font-semibold">{likeCount}</span>
                      </button>
                  </div>
              </div>
          </div>
      </Card>
    </Link>
  );
};

export default PromptCard;