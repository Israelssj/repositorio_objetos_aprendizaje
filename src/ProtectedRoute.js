
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.user.rol.nombreRol)) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default ProtectedRoute;
