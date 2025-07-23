import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../navbar/Navbar';
import './History.css';

const History = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [username] = useState('John Doe'); // Puedes obtener esto del servicio de autenticación
  const [showLogoutButton] = useState(true);
  const navigate = useNavigate();

  const historyItems = [
    {
      name: 'Speaker 01',
      position: 'North side',
      timestamp: '2025-06-07 10:30 AM',
      volume: 75,
      battery: 22
    },
    {
      name: 'Speaker 02',
      position: 'South side',
      timestamp: '2025-06-06 18:50 PM',
      volume: 65,
      battery: 30
    },
    {
      name: 'Speaker 03',
      position: 'Center',
      timestamp: '2025-06-06 13:15 PM',
      volume: 80,
      battery: 40
    },
    {
      name: 'Speaker 03',
      position: 'Center',
      timestamp: '2025-06-06 13:15 PM',
      volume: 80,
      battery: 40
    },
    {
      name: 'Speaker 03',
      position: 'Center',
      timestamp: '2025-06-06 13:15 PM',
      volume: 80,
      battery: 40
    }
  ];

  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Método para manejar el logout
  const handleLogout = () => {
    console.log('Logout clicked');
    // Aquí puedes agregar la lógica de logout
    // Por ejemplo, limpiar el token, redirigir al login, etc.
    navigate('/login');
  };

  return (
    <>
      {/* Agrega el navbar al inicio */}
      <Navbar 
        username={username}
        showLogoutButton={showLogoutButton}
        onLogout={handleLogout}
      />

      <div className="app-container">
        <div className="history-wrapper">
          <h2 className="title">History</h2>

          <div className="history-list">
            {historyItems.map((item, i) => (
              <div 
                key={i}
                className={`history-item ${expandedIndex === i ? 'expanded' : ''}`} 
                onClick={() => toggleItem(i)}
              >
                <div className="summary">
                  <p className="title">{item.name}</p>
                  <p>{item.position}</p>
                  <p>{item.timestamp}</p>
                </div>
                <div className="arrow">{expandedIndex === i ? '▲' : '▼'}</div>

                {expandedIndex === i && (
                  <div className="details">
                    <p>Volume used: {item.volume}%</p>
                    <p>Battery consumed: {item.battery}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link to="/home" className="back-button">Back</Link>
        </div>
      </div>
    </>
  );
};

export default History;