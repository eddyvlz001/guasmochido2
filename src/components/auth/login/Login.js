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

    // SOLUCIÓN TEMPORAL: Usuarios hardcodeados para testing
    const validUsers = [
      { email: 'admin@test.com', password: 'admin123', username: 'admin' },
      { email: 'demo@piensa.com', password: 'demo123', username: 'demo' },
      { email: 'test@emergent.com', password: 'test123', username: 'test' },
      { email: 'usuario@correo.com', password: '123456', username: 'usuario' }
    ];

    try {
      // Verificar credenciales localmente
      const user = validUsers.find(u => 
        (u.email === usernameOrEmail || u.username === usernameOrEmail) && 
        u.password === password
      );

      if (!user) {
        setErrorMessage('Credenciales incorrectas. Usa: admin@test.com/admin123 o demo@piensa.com/demo123');
        setIsLoading(false);
        return;
      }

      console.log('✅ Login successful with temporary solution');

      // Generar token temporal
      const mockToken = btoa(JSON.stringify({
        id: Date.now(),
        username: user.username,
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      }));

      // Handle successful login
      handleLogin(mockToken, 'mock-refresh-token', navigate);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setErrorMessage('Error en el sistema de login');
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
                setUsernameOrEmail('admin@test.com');
                setPassword('admin123');
              }}>
                Load Admin
              </button>
              <button type="button" className="test-btn" onClick={() => {
                setUsernameOrEmail('demo@piensa.com');  
                setPassword('demo123');
              }}>
                Load Demo
              </button>
              <button type="button" className="test-btn direct-login" onClick={async () => {
                try {
                  console.log('🚀 LOGIN DIRECTO clicked!');
                  
                  // Login directo temporal
                  const mockToken = btoa(JSON.stringify({
                    id: Date.now(),
                    username: 'admin',
                    email: 'admin@test.com',
                    exp: Date.now() + 24 * 60 * 60 * 1000
                  }));
                  
                  console.log('✅ Direct login successful');
                  handleLogin(mockToken, 'mock-refresh-token', navigate);
                } catch (err) {
                  console.error('❌ Direct login error:', err);
                  setErrorMessage('Error en login directo: ' + err.message);
                }
              }}>
                🚀 LOGIN DIRECTO
              </button>
            </div>
            <div className="debug-info">
              <small>🔓 SISTEMA TEMPORAL: Usa admin@test.com/admin123 o demo@piensa.com/demo123</small>
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