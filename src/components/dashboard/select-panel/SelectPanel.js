import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../navbar/Navbar';
import './SelectPanel.css';

const SelectPanel = () => {
  const [username, setUsername] = useState('Username');
  const pressedButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUsername(payload.username || payload.name || 'User');
        } catch (e) {
          console.error('Invalid token', e);
        }
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  // Método universal para mouse y touch usando PointerEvent
  const onButtonDown = (event, color) => {
    event.preventDefault(); // Prevenir comportamientos por defecto
    event.stopPropagation(); // Evitar propagación
    
    const target = event.target;
    
    // Solo procesar si no es el botón oculto
    if (target.classList.contains('button-hiden')) {
      return;
    }
    
    pressedButtonRef.current = target;
    
    // Cambiar color y aplicar efecto presionado
    target.style.backgroundColor = color;
    target.classList.add('pressed');
    target.classList.add('shiny');
  };

  // Método cuando se suelta el botón
  const onButtonUp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (pressedButtonRef.current) {
      // Remover efecto presionado
      pressedButtonRef.current.classList.remove('pressed');
      
      // Remover animación brillante después de un delay
      setTimeout(() => {
        if (pressedButtonRef.current) {
          pressedButtonRef.current.classList.remove('shiny');
        }
      }, 600);
      
      pressedButtonRef.current = null;
    }
  };

  // Método para cuando se sale del botón
  const onButtonLeave = (event) => {
    const target = event.target;
    
    // No procesar el botón oculto
    if (target.classList.contains('button-hiden')) {
      return;
    }
    
    target.classList.remove('pressed');
    target.classList.remove('shiny');
    
    if (pressedButtonRef.current === target) {
      pressedButtonRef.current = null;
    }
  };

  // Método de respaldo para compatibilidad
  const changeColor = (event, color) => {
    event.preventDefault();
    const target = event.target;
    
    if (target.classList.contains('button-hiden')) {
      return;
    }
    
    target.style.backgroundColor = color;
    target.classList.add('shiny');
    
    setTimeout(() => {
      target.classList.remove('shiny');
    }, 600);
  };

  return (
    <div className="select-panel-container">
      <Navbar 
        username={username} 
        showLogoutButton={true}
        onLogout={logout}
      />

      <div className="container">
        <div className="panel">
          <div className="panel-content">
            <div className="title">Control Panel</div>
            <div className="buttons">
              <Link to="/dashboard/control-panel">
                <button 
                  className="circle-btn" 
                  onPointerDown={(e) => onButtonDown(e, 'yellow')}
                  onPointerUp={onButtonUp}
                  onPointerLeave={onButtonLeave}
                >
                </button>
              </Link>
              <Link to="/dashboard/control-panel">
                <button 
                  className="circle-btn" 
                  onPointerDown={(e) => onButtonDown(e, 'red')}
                  onPointerUp={onButtonUp}
                  onPointerLeave={onButtonLeave}
                >
                </button>
              </Link>
              <Link to="/dashboard/control-panel">
                <button 
                  className="circle-btn" 
                  onPointerDown={(e) => onButtonDown(e, 'purple')}
                  onPointerUp={onButtonUp}
                  onPointerLeave={onButtonLeave}
                >
                </button>
              </Link>
              <div className="spacer"></div>
              <Link to="/dashboard/control-panel">
                <button 
                  className="circle-btn" 
                  onPointerDown={(e) => onButtonDown(e, 'limegreen')}
                  onPointerUp={onButtonUp}
                  onPointerLeave={onButtonLeave}
                >
                </button>
              </Link>
              <button className="circle-btn button-hiden">
              </button>
              <Link to="/dashboard/control-panel">
                <button 
                  className="circle-btn move-right" 
                  onPointerDown={(e) => onButtonDown(e, 'blue')}
                  onPointerUp={onButtonUp}
                  onPointerLeave={onButtonLeave}
                >
                </button>
              </Link>
            </div>
          </div>
          <Link to="/home" className="back-button">Back</Link>
        </div>
      </div>
    </div>
  );
};

export default SelectPanel;