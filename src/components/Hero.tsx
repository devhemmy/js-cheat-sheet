import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/javascript');
  };

  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">Prepare for your next interview</h1>
        <p className="hero-subtitle">Your one-stop resource for JavaScript, TypeScript, and React interview preparation.</p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
