import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { 
  UserIcon, 
  SettingsIcon, 
  PlusIcon, 
  HeartIcon, 
  BookmarkIcon, 
  LogOutIcon,
  KeyIcon,
} from './icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenApiKeyModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const MenuItem: React.FC<{ to?: string; onClick?: () => void; children: React.ReactNode; isButton?: boolean; isDestructive?: boolean }> = ({ to, onClick, children, isButton, isDestructive }) => {
    const classes = `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors w-full text-right ${
      isDestructive 
        ? 'text-red-600 hover:bg-red-50' 
        : 'text-[#344054] hover:bg-gray-100'
    }`;
    
    const internalOnClick = () => {
      if (onClick) onClick();
      onClose();
    };

    if (isButton) {
      return (
        <button onClick={internalOnClick} className={classes}>
          {children}
        </button>
      );
    }

    return (
      <Link to={to || '#'} onClick={internalOnClick} className={classes}>
        {children}
      </Link>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <div className="flex flex-col md:flex-row">
        {/* Left Column: Navigation */}
        <div className="w-full md:w-3/5 p-2 flex flex-col">
          <div className="p-3 mb-2">
            <div className="flex items-center gap-3">
              <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-bold text-base text-[#1C2B3A]">{user.username}</h3>
                <p className="text-sm text-gray-600">demo@example.com</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1 px-1">
            <MenuItem to="/profile">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span>عرض الملف الشخصي</span>
            </MenuItem>
            <MenuItem to="/profile/edit">
              <SettingsIcon className="w-5 h-5 text-gray-500" />
              <span>إعدادات الحساب</span>
            </MenuItem>
             <MenuItem onClick={onOpenApiKeyModal} isButton>
              <KeyIcon className="w-5 h-5 text-gray-500" />
              <span>مفتاح API</span>
            </MenuItem>
          </nav>
          <hr className="my-2 border-gray-200/80" />
          <nav className="space-y-1 px-1">
            <MenuItem to="/profile/liked">
              <HeartIcon className="w-5 h-5 text-gray-500" />
              <span>الأوامر المعجب بها</span>
            </MenuItem>
            <MenuItem to="/profile/bookmarks">
              <BookmarkIcon className="w-5 h-5 text-gray-500" />
              <span>العناصر المحفوظة</span>
            </MenuItem>
          </nav>
          <div className="flex-grow hidden md:block"></div> {/* Spacer for desktop */}
          <hr className="my-2 border-gray-200/80" />
          <nav className="px-1">
              <MenuItem onClick={handleLogout} isButton isDestructive>
                <LogOutIcon className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </MenuItem>
          </nav>
        </div>

        {/* Right Column: Call to Action */}
        <div className="w-full md:w-2/5 bg-gray-50 border-t md:border-t-0 md:border-r border-gray-200/80 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-[#0A2647]/10 p-3 rounded-full mb-4">
              <PlusIcon className="w-6 h-6 text-[#0A2647]" />
            </div>
            <h4 className="font-bold text-[#1C2B3A] mb-1">شارك إبداعك</h4>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              هل لديك أمر رائع؟ شاركه مع المجتمع وساعد الآخرين على الإبداع.
            </p>
            <Link to="/submit" onClick={onClose} className="w-full">
              <Button className="w-full !text-sm">أضف أمرًا</Button>
            </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;