import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const QuickLogin = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const doLogin = () => {
    try {
      console.log('🚀 Quick login executing...');
      
      // Generate mock token
      const mockToken = btoa(JSON.stringify({
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        exp: Date.now() + 24 * 60 * 60 * 1000
      }));

      console.log('✅ Mock token generated');
      
      // Call handleLogin from context
      handleLogin(mockToken, 'mock-refresh-token', navigate);
      
      console.log('✅ Login function called, should redirect now');
    } catch (error) {
      console.error('❌ Login error:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>SARA</h1>
        
        <div style={{ marginBottom: '20px', color: '#666' }}>
          <p>Sistema de Login Temporal</p>
          <p>Click para acceder al dashboard</p>
        </div>

        <button 
          onClick={doLogin}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          🚀 ACCEDER AL DASHBOARD
        </button>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
          <p>Usuario: admin@test.com</p>
          <p>Sistema temporal funcionando</p>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;