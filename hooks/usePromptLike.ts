import { useState, useCallback, useEffect } from 'react';

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
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);

    // Effect to synchronize state with localStorage when component mounts or promptId changes.
    useEffect(() => {
        if (promptId) { // Only run if we have a valid ID
            const likedPrompts = getLikedPromptsFromStorage();
            setIsLiked(likedPrompts.has(promptId));
            setLikeCount(initialLikes); // Always reset count to the source of truth
        }
    }, [promptId, initialLikes]);

    const toggleLike = useCallback(() => {
        if (!promptId) return; // Guard against empty ID

        // Update isLiked state immediately for responsiveness
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        // Update likeCount based on the new state
        setLikeCount(currentCount => newIsLiked ? currentCount + 1 : currentCount - 1);

        // Persist the change to localStorage
        const likedIds = getLikedPromptsFromStorage();
        if (newIsLiked) {
            likedIds.add(promptId);
        } else {
            likedIds.delete(promptId);
        }
        saveLikedPromptsToStorage(likedIds);
    }, [isLiked, promptId]);


    return { isLiked, likeCount, toggleLike };
};