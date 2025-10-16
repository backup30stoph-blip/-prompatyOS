import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { EditIcon, PlusIcon, SparklesIcon } from './icons';

const BubbleMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { to: "/submit-post", label: "اكتب مقالاً", icon: <EditIcon className="w-6 h-6" /> },
    { to: "/submit", label: "أضف أمرًا", icon: <PlusIcon className="w-6 h-6" /> },
    { to: "/generate", label: "ولّد بـ AI", icon: <SparklesIcon className="w-6 h-6" /> },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Menu Items */}
        <div 
          className="flex flex-col items-center gap-4 transition-all duration-300 ease-in-out"
          style={{ transform: isOpen ? 'translateY(0)' : 'translateY(10px)', opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }}
        >
          {menuItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="w-14 h-14 bg-white text-[#0A2647] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 group relative"
              aria-label={item.label}
            >
              {item.icon}
              <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Main FAB Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-[#0A2647] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#1A3F75] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#F8F9FA] focus:ring-[#0A2647] transition-all duration-300 hover:scale-105 group"
          aria-expanded={isOpen}
          aria-label="Open create menu"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <PlusIcon className="w-7 h-7" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default BubbleMenu;