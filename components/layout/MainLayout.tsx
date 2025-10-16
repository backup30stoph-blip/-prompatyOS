import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BubbleMenu from '../BubbleMenu';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        {children}
      </main>
      <Footer />
      <BubbleMenu />
    </div>
  );
};

export default MainLayout;