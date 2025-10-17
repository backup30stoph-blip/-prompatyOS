import React from 'react';
import { usePostReactions } from '../hooks/usePostReactions';
import { Reactions, ReactionType } from '../types';
import { HeartIcon, LightbulbIcon, LaughIcon, FireIcon } from './icons';

interface PostReactionsProps {
  postId: string;
  initialReactions: Reactions;
}

const ReactionButton: React.FC<{
    type: ReactionType;
    icon: React.ReactNode;
    count: number;
    isSelected: boolean;
    onClick: (type: ReactionType) => void;
    colors: { bg: string, text: string, ring: string };
}> = ({ type, icon, count, isSelected, onClick, colors }) => (
    <button
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(type);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isSelected 
            ? `${colors.bg} ${colors.text} border-current`
            : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
        }`}
        aria-pressed={isSelected}
    >
        {icon}
        <span>{count}</span>
    </button>
);

const PostReactions: React.FC<PostReactionsProps> = ({ postId, initialReactions }) => {
    const { reactions, userReaction, handleReaction } = usePostReactions(postId, initialReactions);

    const reactionMeta: {
        type: ReactionType;
        icon: React.ReactNode;
        colors: { bg: string, text: string, ring: string };
    }[] = [
        { type: 'heart', icon: <HeartIcon className="w-5 h-5" filled={userReaction === 'heart'} />, colors: { bg: 'bg-red-100', text: 'text-red-600', ring: 'focus:ring-red-500' } },
        { type: 'insightful', icon: <LightbulbIcon className="w-5 h-5" />, colors: { bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'focus:ring-yellow-500' } },
        { type: 'funny', icon: <LaughIcon className="w-5 h-5" />, colors: { bg: 'bg-green-100', text: 'text-green-600', ring: 'focus:ring-green-500' } },
        { type: 'fire', icon: <FireIcon className="w-5 h-5" />, colors: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'focus:ring-orange-500' } }
    ];

    return (
        <div className="flex flex-wrap items-center gap-2">
            {reactionMeta.map(meta => (
                <ReactionButton 
                    key={meta.type}
                    type={meta.type}
                    icon={meta.icon}
                    count={reactions[meta.type]}
                    isSelected={userReaction === meta.type}
                    onClick={handleReaction}
                    colors={meta.colors}
                />
            ))}
        </div>
    );
};

export default PostReactions;