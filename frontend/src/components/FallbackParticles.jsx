import React from 'react';
import './FallbackParticles.css';

const FallbackParticles = ({ particleCount = 50, className = "" }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => (
    <div
      key={i}
      className="fallback-particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      }}
    />
  ));

  return (
    <div className={`fallback-particles-container ${className}`}>
      {particles}
    </div>
  );
};

export default FallbackParticles;
