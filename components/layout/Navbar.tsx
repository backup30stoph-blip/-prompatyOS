import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { 
    SettingsIcon, TextIcon, ImageIcon, VideoIcon, CodeIcon, PlusIcon, BookOpenIcon, 
    ChevronLeftIcon, CloseIcon, LogoIcon, SparklesIcon, EditIcon, SearchIcon, 
    ChevronDownIcon, WritingIcon, BusinessIcon, ArtIcon, DesignIcon 
} from '../icons';
import { PromptCategory } from '../../types';
import ProfileModal from '../ProfileModal';
import ApiKeyModal from '../ApiKeyModal';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `nav-link-underline flex items-center gap-2 py-2 text-base font-semibold transition-colors duration-300 text-[#344054] hover:text-[#0A2647] ${
      isActive ? 'active text-[#0A2647]' : ''
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
      isActive 
        ? 'bg-[#0A2647]/10 text-[#0A2647]' 
        : 'text-[#344054] hover:bg-gray-100'
    }`;
  
  const allCategoryLinks = [
    { to: `/prompts?category=${PromptCategory.TEXT}`, label: 'برومبت نص', icon: <TextIcon className="w-5 h-5 text-blue-500" /> },
    { to: `/prompts?category=${PromptCategory.IMAGE}`, label: 'برومبت صورة', icon: <ImageIcon className="w-5 h-5 text-purple-500" /> },
    { to: `/prompts?category=${PromptCategory.VIDEO}`, label: 'برومبت فيديو', icon: <VideoIcon className="w-5 h-5 text-pink-500" /> },
    { to: `/prompts?category=${PromptCategory.CODE}`, label: 'برومبت برمجة', icon: <CodeIcon className="w-5 h-5 text-green-500" /> },
    { to: `/prompts?category=${PromptCategory.WRITING}`, label: 'برومبت كتابة', icon: <WritingIcon className="w-5 h-5 text-orange-500" /> },
    { to: `/prompts?category=${PromptCategory.BUSINESS}`, label: 'برومبت أعمال', icon: <BusinessIcon className="w-5 h-5 text-indigo-500" /> },
    { to: `/prompts?category=${PromptCategory.ART}`, label: 'برومبت فن', icon: <ArtIcon className="w-5 h-5 text-red-500" /> },
    { to: `/prompts?category=${PromptCategory.DESIGN}`, label: 'برومبت تصميم', icon: <DesignIcon className="w-5 h-5 text-teal-500" /> },
  ];

  const desktopNavLinks = [
      { to: '/prompts', label: 'تصفح', icon: <SearchIcon className="w-5 h-5" />, end: false },
      ...allCategoryLinks.slice(0, 5).map(c => ({...c, label: c.label, end: false})),
      { to: '/blog', label: 'المدونة', icon: <BookOpenIcon className="w-5 h-5" />, end: false },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleOpenApiKeyModal = () => {
    setIsProfileModalOpen(false);
    setIsApiKeyModalOpen(true);
  };

  return (
    <>
      <nav className={`bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 h-20 transition-shadow duration-300 ${isScrolled ? 'shadow-md border-b-transparent' : 'border-b-gray-200'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Left Side (Logo) */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <LogoIcon className="h-9 w-9 text-[#0A2647] group-hover:rotate-[-12deg] transition-transform" />
                <span className="text-2xl font-bold text-[#0A2647]">برمباتي</span>
              </Link>
            </div>

            {/* Center (Nav Links) */}
            <div className="hidden lg:flex items-center justify-center gap-6">
                {desktopNavLinks.map(link => (
                    <NavLink key={link.to} to={link.to} className={navLinkClasses} end={link.end}>
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* Right Side (Actions & Profile) */}
            <div className="flex-1 flex justify-end items-center">
              {user ? (
                <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 focus:outline-none p-1 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2647]">
                    <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.username} />
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="secondary" className="bg-transparent hover:bg-gray-100">تسجيل الدخول</Button>
                    </Link>
                    <Link to="/login">
                        <Button>إنشاء حساب</Button>
                    </Link>
                </div>
              )}
              
              {/* Mobile Menu Toggle */}
              <div className="flex items-center lg:hidden ms-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800"
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <i className="fa-solid fa-bars block h-6 w-6"></i>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onOpenApiKeyModal={handleOpenApiKeyModal}
      />
      
      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" onClick={closeMenu}></div>
            <div className="absolute top-0 end-0 w-full max-w-sm bg-[#F8F9FA] h-full shadow-xl overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2">
                        <LogoIcon className="h-7 w-7 text-[#0A2647]" />
                        <span className="text-xl font-bold text-[#0A2647]">برمباتي</span>
                    </Link>
                    <button onClick={closeMenu} className="p-2 rounded-md text-gray-400 hover:bg-gray-100"><CloseIcon className="w-6 h-6"/></button>
                </div>
                
                <div className="flex-grow p-4 space-y-4">
                  <NavLink to="/blog" className={mobileNavLinkClasses} onClick={closeMenu}>
                    <BookOpenIcon className="w-5 h-5" />
                    <span>المدونة</span>
                  </NavLink>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="px-4 text-sm font-semibold text-gray-500 mb-2">الأقسام</h3>
                    <NavLink to="/prompts" className={mobileNavLinkClasses} onClick={closeMenu}>
                        <SearchIcon className="w-5 h-5" />
                        <span>عرض كل الأوامر</span>
                    </NavLink>
                    {allCategoryLinks.map(link => (
                        <NavLink key={link.to} to={link.to} className={mobileNavLinkClasses} onClick={closeMenu}>
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-200 p-4 bg-white">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.username} />
                            <div>
                                <p className="font-semibold text-[#1C2B3A]">{user.username}</p>
                                <Link to="/profile" onClick={closeMenu} className="text-sm text-[#0A2647] hover:underline">
                                    عرض الملف الشخصي
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" onClick={closeMenu} className="flex-1">
                                <Button variant="secondary" className="w-full">تسجيل الدخول</Button>
                            </Link>
                            <Link to="/login" onClick={closeMenu} className="flex-1">
                                <Button className="w-full">إنشاء حساب</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;