import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
            const { data: userProfile } = await supabase
                .from('users')
                .select('id, username, role')
                .eq('id', session.user.id)
                .single();
            setProfile(userProfile as Profile | null);
        }
        setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
            const { data: userProfile } = await supabase
                .from('users')
                .select('id, username, role')
                .eq('id', session.user.id)
                .single();
            setProfile(userProfile as Profile | null);
        } else {
            setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password_unc: string) => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const { error } = await supabase.auth.signInWithPassword({ email, password: password_unc });
    if (error) throw error;
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
