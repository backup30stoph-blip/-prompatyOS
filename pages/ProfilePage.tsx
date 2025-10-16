import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPrompts } from '../services/apiService';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import Button from '../components/ui/Button';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import { Loader2Icon } from '../components/icons';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPrompts = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const allPrompts = await getPrompts();
        setUserPrompts(allPrompts.filter(p => p.author?.id === user.id));
      } catch (err) {
        setError("Failed to fetch user prompts.");
        console.error("Failed to fetch user prompts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPrompts();
  }, [user]);
  
  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <div className="space-y-12">
      <ProfileHeaderCard />
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#303841]">الأوامر التي أضفتها</h2>
          <Link to="/submit">
            <Button>أضف أمرًا جديدًا</Button>
          </Link>
        </div>
        {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2Icon className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        ) : error ? (
            <div className="text-center py-16 text-red-600">{error}</div>
        ) : userPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600 bg-white border border-gray-200 rounded-lg">
              <p>لم تقم بإضافة أي أوامر حتى الآن.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
