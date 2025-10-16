
import { useState, useCallback } from 'react';

export const LIKED_PROMPTS_KEY = 'likedPrompts';

// Helper functions outside the hook to avoid re-declaration on every render
const getLikedPromptsFromStorage = (): Set<string> => {
    try {
        const item = localStorage.getItem(LIKED_PROMPTS_KEY);
        return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
        console.error('Error reading liked prompts from localStorage', error);
        return new Set();
    }
};

const saveLikedPromptsToStorage = (likedIds: Set<string>) => {
    try {
        localStorage.setItem(LIKED_PROMPTS_KEY, JSON.stringify(Array.from(likedIds)));
    } catch (error) {
        console.error('Error saving liked prompts to localStorage', error);
    }
};

export const usePromptLike = (promptId: string, initialLikes: number) => {
    const [isLiked, setIsLiked] = useState(() => getLikedPromptsFromStorage().has(promptId));
    const [likeCount, setLikeCount] = useState(initialLikes);

    const toggleLike = useCallback(() => {
        setIsLiked(currentIsLiked => {
            const newIsLiked = !currentIsLiked;
            const likedIds = getLikedPromptsFromStorage();
            
            if (newIsLiked) {
                likedIds.add(promptId);
                setLikeCount(c => c + 1);
            } else {
                likedIds.delete(promptId);
                setLikeCount(c => c - 1);
            }
            
            saveLikedPromptsToStorage(likedIds);
            return newIsLiked;
        });
    }, [promptId]);

    return { isLiked, likeCount, toggleLike };
};