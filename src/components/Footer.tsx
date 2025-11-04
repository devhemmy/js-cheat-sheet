import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} JS Cheat Sheet. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
