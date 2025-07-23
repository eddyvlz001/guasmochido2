import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload.username || null);
      } catch (e) {
        console.error('Token inválido, limpiando sesión.', e);
        logout();
      }
    }
    setLoading(false);
  };

  const handleLogin = (token, refreshToken, navigate) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    loadUserFromToken();
    if (navigate) {
      navigate('/home');
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    if (navigate) {
      navigate('/auth/login');
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const value = {
    user,
    handleLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};