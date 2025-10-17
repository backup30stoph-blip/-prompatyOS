import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AuthContext';

// Simple Icons for the sidebar
const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


const Sidebar: React.FC = () => {
    const { logout, profile } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-orange-800 text-white' 
        : 'text-orange-100 hover:bg-orange-600 hover:text-white'
    }`;

    return (
        <div className="flex h-full min-h-0 flex-col bg-orange-700">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4 text-white">
                    <span className="text-lg font-bold">لوحة تحكم برمباتي</span>
                </div>
                <nav className="mt-5 flex-1 space-y-1 px-2">
                    <NavLink to="/dashboard" className={navLinkClasses} end>
                        <HomeIcon className="h-5 w-5" />
                        <span>الرئيسية</span>
                    </NavLink>
                    <NavLink to="/prompts" className={navLinkClasses}>
                        <ListIcon className="h-5 w-5" />
                        <span>إدارة الأوامر</span>
                    </NavLink>
                    <NavLink to="/posts" className={navLinkClasses}>
                        <DocumentIcon className="h-5 w-5" />
                        <span>إدارة المقالات</span>
                    </NavLink>
                    {/* Add more links here for Posts, Users etc. */}
                </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-orange-800 p-4">
                <div className="flex-shrink-0 w-full group">
                    <div className="flex items-center">
                        <div>
                            <p className="text-sm font-medium text-white">{profile?.username}</p>
                            <button onClick={handleLogout} className="text-xs font-medium text-orange-200 group-hover:text-white">
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
        <aside className="hidden md:flex md:w-64 md:flex-shrink-0">
             <Sidebar />
        </aside>
        <main className="flex flex-1 flex-col overflow-y-auto">
            <div className="p-8">
              {children}
            </div>
        </main>
    </div>
  );
};

export default AdminLayout;