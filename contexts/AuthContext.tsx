import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
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

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile as User | null);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(profile as User | null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error('Error logging in with GitHub:', error);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  // Mock stats for the profile dropdown can remain for now
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
