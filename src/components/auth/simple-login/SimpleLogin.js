import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (userType) => {
    setLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store token for protected routes
    const mockToken = btoa(JSON.stringify({
      id: Date.now(),
      username: userType,
      email: `${userType}@test.com`,
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('refreshToken', 'mock-refresh-token');
    
    console.log(`✅ ${userType} login successful!`);
    
    // Navigate to dashboard
    navigate('/home');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '400px'
      }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '10px',
          fontSize: '28px',
          letterSpacing: '2px'
        }}>
          S | A | R | A
        </h1>
        
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Sistema de Acceso Rápido
        </p>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>
            Selecciona tu perfil:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              onClick={() => handleLogin('admin')}
              disabled={loading}
              style={{
                background: loading ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '⏳ Cargando...' : '👨‍💼 LOGIN COMO ADMIN'}
            </button>

            <button 
              onClick={() => handleLogin('demo')}
              disabled={loading}
              style={{
                background: loading ? '#ccc' : '#2196F3',
                color: 'white',  
                border: 'none',
                padding: '15px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '⏳ Cargando...' : '👤 LOGIN COMO DEMO'}
            </button>

            <button 
              onClick={() => handleLogin('test')}
              disabled={loading}
              style={{
                background: loading ? '#ccc' : '#FF9800',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                fontSize: '16px',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '⏳ Cargando...' : '🧪 LOGIN COMO TEST'}
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p><strong>🚀 Sistema funcionando correctamente</strong></p>
          <p>Haz click en cualquier botón para acceder al dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;