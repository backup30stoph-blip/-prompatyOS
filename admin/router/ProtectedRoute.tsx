import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { profile, loading } = useAdminAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  // To access the dashboard, user must be logged in and have the 'admin' role.
  if (!profile || profile.role !== 'admin') {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
