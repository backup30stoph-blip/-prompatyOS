import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StarIcon, EditIcon, LinkIcon, TwitterIcon, GithubIcon, LinkedInIcon, UsersIcon, HeartIcon, BookOpenIcon } from './icons';
import Button from './ui/Button';

// Sub-components for stats to keep the main component clean
const StatItem: React.FC<{ to: string; icon: React.ReactNode; value: string | number; label: string; colorClass?: string }> = ({ to, icon, value, label, colorClass = 'text-[#303841]' }) => (
  <Link to={to} className="p-3 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center justify-center space-y-1">
    <div className={`flex items-center gap-2 text-2xl font-bold ${colorClass}`}>
      {icon}
      <span>{value}</span>
    </div>
    <div className="text-sm text-gray-500">{label}</div>
  </Link>
);

const StatDisplay: React.FC<{ icon: React.ReactNode; value: string | number; label: string; colorClass?: string }> = ({ icon, value, label, colorClass = 'text-[#303841]' }) => (
  <div className="p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
    <div className={`flex items-center gap-2 text-2xl font-bold ${colorClass}`}>
      {icon}
      <span>{value}</span>
    </div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);


const ProfileHeaderCard: React.FC = () => {
  const { user, stats } = useAuth();

  if (!user) {
    return null;
  }

  const socialLinks = user.social ? Object.entries(user.social).filter(([, value]) => value) : [];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0 order-2 sm:order-1">
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-20 h-20 rounded-full"
              />
              {user.is_premium && (
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white">
                  <StarIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="order-1 sm:order-2">
              <h1 className="font-bold text-3xl text-[#303841]">{user.username}</h1>
              <p className="text-sm text-gray-500 mt-1">
                عضو منذ {user.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }) : 'يناير ٢٠٢٤'}
              </p>
            </div>
          </div>
          <Link to="/profile/edit" className="w-full sm:w-auto">
            <Button variant="secondary" className="bg-white hover:bg-gray-50 border border-gray-300 !text-gray-700 focus:ring-gray-400 flex items-center gap-2 w-full justify-center">
              <EditIcon className="w-4 h-4" />
              <span>تعديل الملف الشخصي</span>
            </Button>
          </Link>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 mt-4 text-base leading-relaxed">{user.bio}</p>
        )}

        {/* Links */}
        {(user.website || socialLinks.length > 0) && (
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 text-gray-500">
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-[#D72323] transition-colors">
                <LinkIcon className="w-4 h-4" />
                <span className="font-medium">{user.website.replace(/https?:\/\//, '')}</span>
              </a>
            )}
            {socialLinks.map(([key, value]) => (
                <a key={key} href={`https://${key}.com/${value}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-[#D72323] transition-colors">
                    {key === 'twitter' && <TwitterIcon className="w-4 h-4" />}
                    {key === 'github' && <GithubIcon className="w-4 h-4" />}
                    {key === 'linkedin' && <LinkedInIcon className="w-4 h-4" />}
                    <span className="font-medium">@{value}</span>
                </a>
            ))}
          </div>
        )}
      </div>

      {/* Level & Progress */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-bold text-[#303841] flex items-center gap-1.5">
            <span className="text-yellow-500">🌟</span>
            المستوى {stats?.level || 5}
          </span>
          <span className="text-md font-medium text-gray-600">{stats?.current_points || 850} نقطة</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${stats?.progress_percentage || 75}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">{stats?.points_to_next || 150} نقطة للمستوى التالي</p>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center">
            <StatItem 
                to="/profile/followers" 
                icon={<UsersIcon className="w-6 h-6 text-gray-400" />} 
                value={stats?.followers_count || 234}
                label="متابع"
            />
            <StatItem
                to="/profile/liked"
                icon={<HeartIcon className="w-6 h-6 text-red-400" />}
                value={stats?.total_likes || '1.2k'}
                label="إعجاب"
                colorClass="text-[#D72323]"
            />
            <StatDisplay
                icon={<BookOpenIcon className="w-6 h-6 text-gray-400" />}
                value={stats?.total_prompts || 42}
                label="أمر"
            />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;