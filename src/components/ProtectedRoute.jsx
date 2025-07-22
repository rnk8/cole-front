import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, logout } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      // Si el usuario está autenticado pero no tiene el rol correcto, cerramos su sesión.
      logout();
    }
  }, [loading, isAuthenticated, user, allowedRoles, logout]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Esto previene que se renderice brevemente el contenido antes de que el useEffect redireccione.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 