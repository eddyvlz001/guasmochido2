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

    try {
      // Call the real backend API
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        usernameOrEmail: usernameOrEmail,
        password: password
      });

      // Handle successful login
      handleLogin(response.data.token, response.data.refreshToken, navigate);
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.status === 401) {
        setErrorMessage('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Error al conectar con el servidor. Intenta de nuevo.');
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