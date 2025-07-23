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
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const onLogin = async (e) => {
    e.preventDefault();
    
    if (!usernameOrEmail || !password) {
      setErrorMessage('Por favor, llena todos los campos.');
      return;
    }

    // Credenciales de prueba para login sin backend
    const validCredentials = [
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'user@test.com', password: 'user123' },
      { email: 'demo@piensa.com', password: 'demo123' },
      { email: 'test@example.com', password: 'test123' }
    ];

    // Verificar credenciales localmente
    const validUser = validCredentials.find(
      cred => cred.email === usernameOrEmail && cred.password === password
    );

    if (validUser) {
      // Crear un token mock para simular login exitoso
      const mockToken = btoa(JSON.stringify({
        username: usernameOrEmail.split('@')[0],
        email: usernameOrEmail,
        exp: Date.now() + 3600000 // 1 hora
      }));
      
      handleLogin(mockToken, 'mock-refresh-token', navigate);
    } else {
      setErrorMessage('Credenciales incorrectas. Prueba con: admin@test.com / admin123');
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

          {/* Credenciales de prueba */}
          <div className="demo-credentials">
            <h4>🔑 Credenciales de Prueba:</h4>
            <div className="credential-item">
              <strong>Email:</strong> admin@test.com<br/>
              <strong>Password:</strong> admin123
            </div>
            <div className="credential-item">
              <strong>Email:</strong> demo@piensa.com<br/>
              <strong>Password:</strong> demo123
            </div>
          </div>

          <div className="forgot">Forget password?</div>

          <button className="btn-black" type="submit">Sign in</button>
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