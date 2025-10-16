import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { ToastProvider } from './contexts/ToastContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/router/ProtectedRoute';

// Page Imports
import HomePage from './pages/HomePage';
import PromptsPage from './pages/PromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import LoginPage from './pages/LoginPage';
import SubmitPage from './pages/SubmitPage';
import ProfilePage from './pages/ProfilePage';
import LikedPromptsPage from './pages/LikedPromptsPage';
import BookmarkedPromptsPage from './pages/BookmarkedPromptsPage';
import EditProfilePage from './pages/EditProfilePage';
import FollowersPage from './pages/FollowersPage';
import PromptGeneratorPage from './pages/PromptGeneratorPage';
import SubmitPostPage from './pages/SubmitPostPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Profile Layout for nested routes
const ProfileLayout: React.FC = () => {
    return (
        <Routes>
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditProfilePage />} />
            <Route path="liked" element={<LikedPromptsPage />} />
            <Route path="bookmarks" element={<BookmarkedPromptsPage />} />
            <Route path="followers" element={<FollowersPage />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <SearchProvider>
          <ApiKeyProvider>
            <Router>
                <ScrollToTop />
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/prompts" element={<PromptsPage />} />
                    <Route path="/prompts/:id" element={<PromptDetailPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/submit" element={<SubmitPage />} />
                        <Route path="/submit-post" element={<SubmitPostPage />} />
                        <Route path="/generate" element={<PromptGeneratorPage />} />
                        <Route path="/profile/*" element={<ProfileLayout />} />
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<div className="text-center py-20"><h2>404: Page Not Found</h2></div>} />
                  </Routes>
                </MainLayout>
            </Router>
          </ApiKeyProvider>
        </SearchProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;