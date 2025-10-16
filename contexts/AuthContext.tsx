import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { mockUsers } from '../services/mockData';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  stats: any; // Using 'any' for mock stats flexibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // MOCK AUTHENTICATION: Automatically log in the test user on load.
  useEffect(() => {
    // Simulate checking for an active session.
    setTimeout(() => {
      setUser(mockUsers[0]); // Set the first mock user as the logged-in user.
      setLoading(false);
    }, 300); // Short delay to mimic async behavior.
  }, []);

  // Mock login/logout functions are kept for potential manual use
  const login = () => {
    console.log("Mock login triggered.");
    setLoading(true);
    setTimeout(() => {
        setUser(mockUsers[0]); // Log in as the first mock user
        setLoading(false);
    }, 500);
  };

  const logout = () => {
    console.log("Mock logout triggered.");
    setUser(null);
  };
  
  // Mock stats for the profile dropdown (can be integrated later)
  const stats = {
      level: 5,
      level_icon: '🌟',
      progress_percentage: 75,
      current_points: 850,
      points_to_next: 150,
      total_prompts: 42,
      total_likes: '1.2k',
      followers_count: 234,
      badges: [
          { id: '1', name: 'Creative Mind', icon: '🎨' },
          { id: '2', name: 'Rising Star', icon: '⭐' },
          { id: '3', name: 'Expert Creator', icon: '🚀' },
      ]
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, stats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};