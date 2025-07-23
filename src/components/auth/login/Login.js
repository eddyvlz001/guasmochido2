import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from '../../logo/Logo';
import './Login.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const onLogin = async (e) => {
    e.preventDefault();
    
    if (!usernameOrEmail || !password) {
      setErrorMessage('Por favor, llena todos los campos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    console.log('🔐 Attempting login with:', { 
      usernameOrEmail, 
      passwordLength: password.length,
      apiUrl: '/.netlify/functions/login'
    });

    try {
      // Call the Netlify serverless function
      const response = await axios.post('/.netlify/functions/login', {
        email: usernameOrEmail,
        password: password
      });

      console.log('✅ Login successful:', response.data);

      // Handle successful login
      handleLogin(response.data.token, response.data.refreshToken, navigate);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        setErrorMessage('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else if (err.code === 'ECONNREFUSED') {
        setErrorMessage('Error: No se puede conectar con el servidor backend.');
      } else if (err.code === 'ERR_NETWORK') {
        setErrorMessage('Error de red: Verifica la conexión al backend.');
      } else {
        setErrorMessage(`Error: ${err.message || 'Error desconocido'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Logo />

        {/* Formulario de Login */}
        <form className="login-form" onSubmit={onLogin}>
          <input 
            className="input" 
            type="email" 
            placeholder="Email" 
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            name="email"
            required 
          />

          <input 
            className="input" 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required 
          />

          {/* Mensaje de error */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Panel de Testing - TEMPORAL */}
          <div className="testing-panel">
            <h4>🧪 TESTING PANEL</h4>
            <div className="test-buttons">
              <button type="button" className="test-btn" onClick={() => {
                setUsernameOrEmail('test@emergent.com');
                setPassword('test123');
              }}>
                Load Test User
              </button>
              <button type="button" className="test-btn" onClick={() => {
                setUsernameOrEmail('demo@emergent.com');  
                setPassword('demo123');
              }}>
                Load Demo
              </button>
              <button type="button" className="test-btn direct-login" onClick={async () => {
                try {
                  console.log('🚀 LOGIN DIRECTO clicked!');
                  console.log('📡 Making request to: /.netlify/functions/login');
                  
                  const response = await axios.post('/.netlify/functions/login', {
                    email: 'test@emergent.com',
                    password: 'test123'
                  });
                  
                  console.log('✅ Login response:', response.data);
                  handleLogin(response.data.token, response.data.refreshToken, navigate);
                } catch (err) {
                  console.error('❌ Direct login error:', err);
                  console.error('❌ Error details:', err.response?.data);
                  setErrorMessage('Error en login directo: ' + (err.response?.data?.error || err.message));
                }
              }}>
                🚀 LOGIN DIRECTO
              </button>
            </div>
            <div className="debug-info">
              <small>Backend: /.netlify/functions/login</small>
            </div>
          </div>

          <div className="forgot">Forget password?</div>

          <button className="btn-black" type="submit" disabled={isLoading}>
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider">or continue</div>

        {/* Botón de Google */}
        <button className="btn-google">
          <img src="assets/icons/google-icon.svg" className="icon" alt="Google" />
          Log in with Google
        </button>

        <div className="signup">
          <p>
            Don't have an account?{' '}
            <b><Link to="/auth/register" className="underline-hover">Sign Up</Link></b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;