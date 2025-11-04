import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="logo">JS Cheat Sheet</Link>
        <nav className="nav-links">
          <Link to="/javascript">JavaScript</Link>
          <Link to="/typescript">TypeScript</Link>
          <Link to="/react">React</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
