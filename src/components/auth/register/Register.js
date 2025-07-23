import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../logo/Logo';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!username || !email || !password) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    if (password.length < 4 || password.length > 12) {
      setErrorMessage('La contraseña debe tener entre 4 y 12 caracteres.');
      return;
    }

    try {
      // Simular proceso de registro con delay
      console.log('📝 Attempting registration...', { username, email });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular validación de email existente
      const existingEmails = ['admin@test.com', 'demo@piensa.com'];
      if (existingEmails.includes(email)) {
        setErrorMessage('Este email ya está registrado. Prueba con uno diferente.');
        setSuccessMessage('');
        return;
      }

      console.log('✅ Registration successful');
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo al login...');
      setErrorMessage('');
      
      // Navegar al login después de 2 segundos
      setTimeout(() => navigate('/auth/login'), 2000);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setSuccessMessage('');
      setErrorMessage('Error al registrar. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Logo/>
        <h1 className="register-title">Sign Up</h1>

        {/* Mensajes */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Formulario */}
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              className="input" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              className="input" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              className="input" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot">Be between 4 and 12 characters</div>

          <button className="btn-black" type="button" onClick={onSubmit}>Sign up</button>

          <div className="signup">
            <p>
              You already have an account?{' '}
              <b><Link to="/auth/login" className="underline-hover">Sign In</Link></b>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;