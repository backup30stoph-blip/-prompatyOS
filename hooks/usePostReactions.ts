import { useState, useCallback, useEffect } from 'react';
import { Reactions, ReactionType } from '../types';

export const USER_POST_REACTIONS_KEY = 'userPostReactions';

// Helper functions to interact with localStorage
const getUserReactionsFromStorage = (): Record<string, ReactionType> => {
    try {
        const item = localStorage.getItem(USER_POST_REACTIONS_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error('Error reading user reactions from localStorage', error);
        return {};
    }
};

const saveUserReactionsToStorage = (reactions: Record<string, ReactionType>) => {
    try {
        localStorage.setItem(USER_POST_REACTIONS_KEY, JSON.stringify(reactions));
    } catch (error) {
        console.error('Error saving user reactions to localStorage', error);
    }
};

export const usePostReactions = (postId: string, initialReactions: Reactions) => {
    const [reactions, setReactions] = useState<Reactions>(initialReactions);
    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

    // Effect to synchronize the component state with localStorage on mount
    useEffect(() => {
        if (postId) {
            const userReactions = getUserReactionsFromStorage();
            setUserReaction(userReactions[postId] || null);
            setReactions(initialReactions); // Always start with the fresh counts from props
        }
    }, [postId, initialReactions]);

    const handleReaction = useCallback((reactionType: ReactionType) => {
        if (!postId) return;

        const allUserReactions = getUserReactionsFromStorage();
        const currentReaction = allUserReactions[postId];

        setReactions(currentReactions => {
            const newReactions = { ...currentReactions };
            
            // Case 1: User is removing their current reaction
            if (currentReaction === reactionType) {
                newReactions[reactionType]--;
                delete allUserReactions[postId];
                setUserReaction(null);
            } 
            // Case 2: User is changing their reaction
            else if (currentReaction) {
                newReactions[currentReaction]--;
                newReactions[reactionType]++;
                allUserReactions[postId] = reactionType;
                setUserReaction(reactionType);
            }
            // Case 3: User is adding a new reaction
            else {
                newReactions[reactionType]++;
                allUserReactions[postId] = reactionType;
                setUserReaction(reactionType);
            }
            return newReactions;
        });
        
        saveUserReactionsToStorage(allUserReactions);

    }, [postId]);

    return { reactions, userReaction, handleReaction };
};