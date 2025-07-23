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
    <div className="splash-screen">
      <div className="splash-animation-container">
        <div className="splash-letter-block splash-color-blue">S</div>
        <div className="splash-separator"></div>
        <div className="splash-letter-block splash-color-blue">A</div>
        <div className="splash-separator"></div>
        <div className="splash-letter-block splash-gradient">R</div>
        <div className="splash-separator"></div>
        <div className="splash-letter-block splash-gradient">A</div>
      </div>
    </div>
  );
};

export default SplashScreen;