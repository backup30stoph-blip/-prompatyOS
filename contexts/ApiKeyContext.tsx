import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';

interface ApiKeyContextType {
  isApiKeySet: boolean;
  geminiClient: GoogleGenAI | null;
  saveApiKey: (key: string) => void;
  deleteApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Load API key from local storage on initial mount
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKey(storedKey);
      }
    } catch (error) {
        console.error("Could not read API key from local storage:", error);
    }
  }, []);

  const geminiClient = useMemo(() => {
    if (apiKey) {
      try {
        // As per guidelines, use new GoogleGenAI({apiKey: ...})
        return new GoogleGenAI({ apiKey });
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI client:", error);
        return null;
      }
    }
    return null;
  }, [apiKey]);

  const saveApiKey = (key: string) => {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
    } catch(error) {
        console.error("Could not save API key to local storage:", error);
    }
  };

  const deleteApiKey = () => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
    } catch (error) {
        console.error("Could not delete API key from local storage:", error);
    }
  };

  const isApiKeySet = !!apiKey;

  return (
    <ApiKeyContext.Provider value={{ isApiKeySet, geminiClient, saveApiKey, deleteApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};