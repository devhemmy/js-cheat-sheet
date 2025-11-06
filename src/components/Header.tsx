import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            JS Cheat Sheet
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10" role="navigation" aria-label="Main navigation">
            <Link
              to="/javascript"
              className="relative text-white/80 hover:text-white font-medium py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-violet-600 hover:after:w-full after:transition-all after:duration-300"
            >
              JavaScript
            </Link>
            <Link
              to="/typescript"
              className="relative text-white/80 hover:text-white font-medium py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-violet-600 hover:after:w-full after:transition-all after:duration-300"
            >
              TypeScript
            </Link>
            <Link
              to="/react"
              className="relative text-white/80 hover:text-white font-medium py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-violet-600 hover:after:w-full after:transition-all after:duration-300"
            >
              React
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2">
              <Link
                to="/javascript"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                JavaScript
              </Link>
              <Link
                to="/typescript"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                TypeScript
              </Link>
              <Link
                to="/react"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                React
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
