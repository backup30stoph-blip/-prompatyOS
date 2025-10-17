import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { mockUsers } from '../../services/mockData';
import { User } from '../../types';

interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_MOCK_SESSION_KEY = 'admin_mock_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_MOCK_SESSION_KEY);
      if (session) {
        const adminUser = mockUsers[0];
        const mockProfile: Profile = {
          id: adminUser.id,
          username: `Admin ${adminUser.username}`,
          role: 'admin',
        };
        setUser(adminUser);
        setProfile(mockProfile);
      }
    } catch (e) {
      console.error('Failed to read admin mock session from localStorage', e);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    if (email === 'admin@prompaty.com' && pass === 'password') {
      const adminUser = mockUsers[0];
      const mockProfile: Profile = {
        id: adminUser.id,
        username: `Admin ${adminUser.username}`,
        role: 'admin',
      };
      
      try {
        localStorage.setItem(ADMIN_MOCK_SESSION_KEY, JSON.stringify({ profileId: mockProfile.id }));
        setUser(adminUser);
        setProfile(mockProfile);
        setLoading(false);
      } catch (e) {
        console.error('Failed to save admin mock session', e);
        setLoading(false);
        throw new Error('Could not save session.');
      }
    } else {
      setLoading(false);
      throw new Error('Invalid email or password. Use admin@prompaty.com / password');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_MOCK_SESSION_KEY);
      setUser(null);
      setProfile(null);
    } catch (e) {
      console.error('Failed to remove admin mock session', e);
    }
  };

  const value = { user, profile, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
