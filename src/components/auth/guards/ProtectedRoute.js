import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificar que estamos en el navegador
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return children;
    }
  }

  // Si no hay token o estamos en SSR, redirigir
  return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;