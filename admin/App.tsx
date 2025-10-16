import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAdminAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './router/ProtectedRoute';

const AppRoutes: React.FC = () => {
    const { profile, loading } = useAdminAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={
                    <AdminLayout>
                        <DashboardPage />
                    </AdminLayout>
                } />
            </Route>

            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route path="/" element={profile ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <Router>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </Router>
  );
};

export default App;
