import React from 'react';

const Features = () => {
  return (
    <section id="features" className="features container">
      <div className="feature">
        <div className="feature-icon">📚</div>
        <h3 className="feature-title">Comprehensive</h3>
        <p>Covering a wide range of JavaScript topics, from basics to advanced concepts.</p>
      </div>
      <div className="feature">
        <div className="feature-icon">🔍</div>
        <h3 className="feature-title">Searchable</h3>
        <p>Easily find the code snippets you need with our powerful search functionality.</p>
      </div>
      <div className="feature">
        <div className="feature-icon">📱</div>
        <h3 className="feature-title">Responsive</h3>
        <p>Access the cheat sheet on any device, thanks to our mobile-friendly design.</p>
      </div>
    </section>
  );
};

export default Features;
