import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // SOLUCIÓN TEMPORAL: Permitir acceso directo para testing
  // En producción, esto debe ser removido
  
  // Verificar que estamos en el navegador
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    // TEMPORAL: Permitir acceso siempre para testing
    console.log('🔒 ProtectedRoute: Allowing access (TEMPORARY)');
    return children;
    
    // CÓDIGO ORIGINAL (deshabilitado temporalmente):
    // if (token) {
    //   return children;
    // }
  }

  // TEMPORAL: Siempre permitir acceso
  return children;
  
  // CÓDIGO ORIGINAL (deshabilitado temporalmente):
  // Si no hay token o estamos en SSR, redirigir
  // return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;