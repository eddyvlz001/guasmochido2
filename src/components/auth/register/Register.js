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
      const response = await axios.post('https://backendpiensa-production-e02a.up.railway.app/auth/register', payload);
      setSuccessMessage('¡Cuenta creada exitosamente!');
      setErrorMessage('');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.message || 'Error al registrar.');
    }
  };

  return (
    <section>
      <div className="container">
        <Logo/>
        <h1>Sign Up</h1>

        {/* Mensajes */}
        {errorMessage && (
          <div style={{color: 'red', marginBottom: '10px'}}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{color: 'green', marginBottom: '10px'}}>
            {successMessage}
          </div>
        )}

        {/* Formulario */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username" 
            className="input white-bg" 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            className="input white-bg" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            className="input white-bg" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="forgot">Be between 4 and 12 characters</div>

        <button className="btn-black" onClick={onSubmit}>Sign up</button>

        <div className="signup">
          <p>
            You already have an account?
            <b><Link to="/auth/login" className="underline-hover">Sign In</Link></b>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;