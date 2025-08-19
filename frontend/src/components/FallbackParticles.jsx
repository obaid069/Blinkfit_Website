import React from 'react';
import './FallbackParticles.css';

const FallbackParticles = ({ particleCount = 50, className = "" }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const size = 2 + Math.random() * 4; // Random size between 2-6px
    const color = ['#4CAF50', '#45a049', '#66BB6A'][Math.floor(Math.random() * 3)];
    
    return (
      <div
        key={i}
        className="fallback-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${4 + Math.random() * 6}s`,
        }}
      />
    );
  });

  return (
    <div className={`fallback-particles-container ${className}`}>
      {particles}
    </div>
  );
};

export default FallbackParticles;
