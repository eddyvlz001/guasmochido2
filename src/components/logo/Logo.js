import React from 'react';
import './Logo.css';

const Logo = ({ letters = '' }) => {
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

export default Logo;