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

    const payload = {
      username: username,
      email: email,
      password: password,
    };

    try {
      await axios.post('http://localhost:3001/api/auth/register', payload);
      setSuccessMessage('¡Cuenta creada exitosamente!');
      setErrorMessage('');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.message || 'Error al registrar.');
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