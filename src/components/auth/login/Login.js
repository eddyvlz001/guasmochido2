import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../logo/Logo';
import './Login.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    
    if (!usernameOrEmail || !password) {
      setErrorMessage('Por favor, llena todos los campos.');
      return;
    }

    const payload = {
      usernameOrEmail: usernameOrEmail,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/login', payload);
      localStorage.setItem('token', response.data.token); // si el backend te da un JWT
      navigate('/home'); // redirige al panel
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <body>
      <div className="container">
        <Logo />

        {/* Formulario de Login */}
        <form onSubmit={onLogin}>
          <input 
            className="input white-bg" 
            type="email" 
            placeholder="Email" 
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            name="email"
            required 
          />

          <input 
            className="input white-bg" 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required 
          />

          {/* Mensaje de error */}
          {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

          <div className="forgot">Forget password?</div>

          <button className="btn-black" type="submit">Sign in</button>
        </form>

        <div className="divider">or continue</div>

        {/* Botón de Google */}
        <button className="btn-google">
          <img src="assets/icons/google-icon.svg" className="icon" alt="Google" />
          Log in with Google
        </button>
      </div>
    </body>
  );
};

export default Login;