import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Navbar from '../../navbar/Navbar';
import './DashboardHome.css';

const DashboardHome = () => {
  const [username, setUsername] = useState('Username');
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="sara-dashboard futuristic">
      <Navbar 
        username={username} 
        showLogoutButton={true}
        onLogout={handleLogout}
      />

      <main className="sara-content column-layout">
        <Link to="/dashboard/select-panel" className="widget-card big-card">
          <div className="widget-icon">
            <img className="icon" src="assets/icons/control-panel.svg" alt="Control Icon" />
          </div>
          <div className="widget-label">Control Panel</div>
        </Link>

        <Link to="/dashboard/history" className="widget-card big-card">
          <div className="widget-icon">
            <img className="icon" src="assets/icons/history.svg" alt="History" />
          </div>
          <div className="widget-label">History</div>
        </Link>
      </main>

      <footer className="sara-footer">
        <button className="logout-btn logout-btn-mobile" onClick={handleLogout}>Disconnect</button>
      </footer>
    </div>
  );
};

export default DashboardHome;