import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  stats: any; // Using 'any' for mock stats flexibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_SESSION_KEY = 'mock_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a session in localStorage
    try {
      const session = localStorage.getItem(MOCK_SESSION_KEY);
      if (session) {
        // Log in the first mock user if a session exists
        setUser(mockUsers[0]);
      }
    } catch (e) {
      console.error('Failed to read mock session from localStorage', e);
    }
    setLoading(false);
  }, []);

  const login = () => {
    setLoading(true);
    try {
      // Set the first mock user as the logged-in user
      const mockUser = mockUsers[0];
      setUser(mockUser);
      // Persist the mock session state to localStorage
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ userId: mockUser.id }));
    } catch (e) {
      console.error('Failed to save mock session to localStorage', e);
    }
    setLoading(false);
  };

  const logout = () => {
    try {
      // Clear user from state and remove session from localStorage
      localStorage.removeItem(MOCK_SESSION_KEY);
      setUser(null);
    } catch (e) {
      console.error('Failed to remove mock session from localStorage', e);
    }
  };
  
  // Mock stats for the profile dropdown
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
