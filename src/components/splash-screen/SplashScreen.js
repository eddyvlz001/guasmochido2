import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Espera hasta que termine la animación (~2.7s), luego redirige
    const timer = setTimeout(() => {
      navigate('/auth/login'); // Cambia '/login' por la ruta deseada
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="letter-block color-blue">S</div>
      <div className="separator"></div>
      <div className="letter-block color-blue">A</div>
      <div className="separator"></div>
      <div className="letter-block gradient">R</div>
      <div className="separator"></div>
      <div className="letter-block gradient">A</div>
    </div>
  );
};

export default SplashScreen;