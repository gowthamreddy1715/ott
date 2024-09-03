import React from 'react';
import './Logo.css'
const Logo = () => {
  // Replace 'logo.png' with your actual logo file and adjust the image path
  return (
    <div className="logo-container">
     <img
  src="/images/latest_realm.png"
  alt="Logo"
  style={{
    width: '120px',
    height: 'auto',
    marginTop: '2%', // Adjust the margin as needed
    marginLeft: '2%', // Adjust the margin as needed
    transform: 'translateY(5px)', // Adjust the downward translation
  }}
/>
    </div>
  );
};

export default Logo;
