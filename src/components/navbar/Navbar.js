import React from 'react';
import Logo from '../logo/Logo';
import './Navbar.css';

const Navbar = ({ username = 'Username', showLogoutButton = true, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="sara-navbar">
      <div className="logo-section">
        <Logo />
      </div>
      {showLogoutButton && (
        <button 
          className="logout-btn logout-btn-desktop" 
          onClick={handleLogout}
        >
          Disconnect
        </button>
      )}
      <span className="user-badge">{username}</span>
    </nav>
  );
};

export default Navbar;