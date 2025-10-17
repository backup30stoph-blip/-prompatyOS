import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { 
    SettingsIcon, TextIcon, ImageIcon, VideoIcon, CodeIcon, PlusIcon, BookOpenIcon, 
    ChevronLeftIcon, CloseIcon, LogoIcon, SparklesIcon, EditIcon, SearchIcon, 
    ChevronDownIcon, WritingIcon, BusinessIcon, ArtIcon, DesignIcon, LogInIcon, UserPlusIcon
} from '../icons';
import { PromptCategory, promptCategoryColors } from '../../types';
import ProfileModal from '../ProfileModal';
import ApiKeyModal from '../ApiKeyModal';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  
  // FIX: Define a consistent type for navigation links to handle optional properties correctly.
  type DesktopNavLink = {
    to: string;
    label: string;
    icon: React.ReactElement;
    end: boolean;
    category?: PromptCategory;
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click for create menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const allCategoryLinks = [
    { to: `/prompts?category=${PromptCategory.TEXT}`, label: 'برومبت نص', icon: <TextIcon />, category: PromptCategory.TEXT },
    { to: `/prompts?category=${PromptCategory.IMAGE}`, label: 'برومبت صورة', icon: <ImageIcon />, category: PromptCategory.IMAGE },
    { to: `/prompts?category=${PromptCategory.VIDEO}`, label: 'برومبت فيديو', icon: <VideoIcon />, category: PromptCategory.VIDEO },
    { to: `/prompts?category=${PromptCategory.CODE}`, label: 'برومبت برمجة', icon: <CodeIcon />, category: PromptCategory.CODE },
    { to: `/prompts?category=${PromptCategory.WRITING}`, label: 'برومبت كتابة', icon: <WritingIcon />, category: PromptCategory.WRITING },
    { to: `/prompts?category=${PromptCategory.BUSINESS}`, label: 'برومبت أعمال', icon: <BusinessIcon />, category: PromptCategory.BUSINESS },
    { to: `/prompts?category=${PromptCategory.ART}`, label: 'برومبت فن', icon: <ArtIcon />, category: PromptCategory.ART },
    { to: `/prompts?category=${PromptCategory.DESIGN}`, label: 'برومبت تصميم', icon: <DesignIcon />, category: PromptCategory.DESIGN },
  ];

  const createMenuItems = [
    { to: "/submit", label: "أضف أمرًا", icon: <PlusIcon className="w-5 h-5 text-slate-500" /> },
    { to: "/submit-post", label: "اكتب مقالاً", icon: <EditIcon className="w-5 h-5 text-slate-500" /> },
    { to: "/generate", label: "ولّد بـ AI", icon: <SparklesIcon className="w-5 h-5 text-slate-500" /> },
  ];

  const desktopNavLinks: DesktopNavLink[] = [
      { to: '/prompts', label: 'تصفح', icon: <SearchIcon />, end: false },
      ...allCategoryLinks.slice(0, 4).map(c => ({...c, label: c.label.replace('برومبت ', ''), end: false})),
      { to: '/blog', label: 'المدونة', icon: <BookOpenIcon />, end: false },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleOpenApiKeyModal = () => {
    setIsProfileModalOpen(false);
    setIsApiKeyModalOpen(true);
  };

  return (
    <>
      <nav className={`bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 h-20 transition-shadow duration-300 ${isScrolled ? 'shadow-md border-b-transparent' : 'border-b-slate-200'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Left Side (Logo) */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <LogoIcon className="h-9 w-9 text-orange-500 group-hover:rotate-[-12deg] transition-transform" />
                <span className="text-2xl font-bold text-slate-900">برمباتي</span>
              </Link>
            </div>

            {/* Center (Nav Links) */}
            <div className="hidden lg:flex items-center justify-center gap-6">
                {desktopNavLinks.map(link => (
                    <NavLink 
                      key={link.to} 
                      to={link.to} 
                      className={({ isActive }) => {
                        const baseClasses = 'flex items-center gap-2 py-2 text-base font-semibold transition-colors duration-300 border-b-2';
                        if (isActive) {
                          // FIX: Check for property existence. The explicit type on desktopNavLinks makes this check safe.
                          if (link.category) {
                            const colors = promptCategoryColors[link.category];
                            return `${baseClasses} ${colors.text} ${colors.border}`;
                          }
                          return `${baseClasses} text-orange-600 border-orange-500`; // Fallback
                        }
                        return `${baseClasses} text-slate-600 hover:text-orange-600 border-transparent`;
                      }} 
                      end={link.end}
                    >
                        {/* FIX: Spread existing props to help TypeScript infer the element's prop types correctly and prevent an error when adding className. */}
                        {React.cloneElement(link.icon, {
                          ...link.icon.props,
                          // FIX: Check for property existence. The explicit type on desktopNavLinks makes this check safe.
                          className: `w-5 h-5 ${link.category ? promptCategoryColors[link.category].text : 'text-slate-500'}`
                        })}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* Right Side (Actions & Profile) */}
            <div className="flex-1 flex justify-end items-center gap-3">
              <Link to="/prompts" className="show-above-486-block" aria-label="Search">
                  <Button variant="secondary" className="!p-2.5 bg-white" aria-label="Search">
                      <SearchIcon className="w-5 h-5" />
                  </Button>
              </Link>
              
              <div className="relative show-above-486-block" ref={createMenuRef}>
                  <Button onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)} className="!p-2.5" aria-label="إنشاء">
                      <PlusIcon className="w-5 h-5" />
                  </Button>
                  {isCreateMenuOpen && (
                      <div className="absolute top-full mt-2 end-0 w-auto bg-white rounded-lg shadow-xl border border-slate-200/80 p-1 animate-slide-in-down">
                          <div className="flex items-center gap-1">
                              {createMenuItems.map(item => (
                                  <Link
                                      key={item.to}
                                      to={item.to}
                                      onClick={() => setIsCreateMenuOpen(false)}
                                      className="flex items-center justify-center p-3 text-slate-700 hover:bg-slate-100 rounded-lg"
                                      title={item.label}
                                      aria-label={item.label}
                                  >
                                      {React.cloneElement(item.icon, { className: 'w-6 h-6 text-slate-600' })}
                                  </Link>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {user ? (
                <div className="show-above-486-flex items-center">
                  <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 focus:outline-none p-1 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.username} />
                  </button>
                </div>
              ) : (
                <div className="show-above-486-flex items-center gap-3">
                    <Link to="/login" aria-label="تسجيل الدخول">
                        <Button variant="secondary" className="!p-2.5 bg-white">
                            <LogInIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link to="/login" aria-label="إنشاء حساب">
                        <Button className="!p-2.5">
                            <UserPlusIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
              )}
              
              {/* Mobile Menu Toggle */}
              <div className="flex items-center hide-above-486">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800"
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
            <div className="absolute top-0 end-0 w-full max-w-sm bg-slate-50 h-full shadow-xl overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                    <Link to="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2">
                        <LogoIcon className="h-7 w-7 text-orange-500" />
                        <span className="text-xl font-bold text-slate-900">برمباتي</span>
                    </Link>
                    <button onClick={closeMenu} className="p-2 rounded-md text-slate-400 hover:bg-slate-100"><CloseIcon className="w-6 h-6"/></button>
                </div>
                
                <div className="flex-grow p-4 space-y-4">
                  <div className="pt-0">
                    <h3 className="px-4 text-sm font-semibold text-slate-500 mb-2">إنشاء محتوى</h3>
                    <div className="flex justify-around items-center p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        {createMenuItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `flex-1 flex justify-center items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-orange-100' : 'hover:bg-slate-100'}`}
                                onClick={closeMenu}
                                aria-label={item.label}
                                title={item.label}
                            >
                                {/* FIX: Used a render prop for children to correctly scope `isActive` for styling the icon. */}
                                {({ isActive }) => React.cloneElement(item.icon, {
                                    className: `w-6 h-6 ${isActive ? 'text-orange-700' : 'text-slate-600'}`
                                })}
                            </NavLink>
                        ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="px-4 text-sm font-semibold text-slate-500 mb-2">الأقسام</h3>
                    <NavLink to="/blog" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${ isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`} onClick={closeMenu}>
                      <BookOpenIcon className="w-5 h-5 text-slate-500" />
                      <span>المدونة</span>
                    </NavLink>
                    <NavLink to="/prompts" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${ isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`} onClick={closeMenu}>
                        <SearchIcon className="w-5 h-5 text-slate-500" />
                        <span>عرض كل الأوامر</span>
                    </NavLink>
                    {allCategoryLinks.map(link => (
                        <NavLink 
                          key={link.to} 
                          to={link.to} 
                          className={({ isActive }) => {
                            const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors';
                            if (isActive) {
                              const colors = promptCategoryColors[link.category];
                              return `${baseClasses} ${colors.bg} ${colors.darkerText}`;
                            }
                            return `${baseClasses} text-slate-700 hover:bg-slate-100`;
                          }} 
                          onClick={closeMenu}
                        >
                            {React.cloneElement(link.icon, {
                              className: `w-5 h-5 ${promptCategoryColors[link.category].text}`
                            })}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-200 p-4 bg-white">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.username} />
                            <div>
                                <p className="font-semibold text-slate-800">{user.username}</p>
                                <Link to="/profile" onClick={closeMenu} className="text-sm text-orange-600 hover:underline">
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