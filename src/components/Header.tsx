import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { ROUTES, NAV_ITEMS } from '../config/routes';
import { navLink, layout, text } from '../styles/shared';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className={layout.container}>
        <div className={`${layout.flexBetween} h-20`}>
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className={`text-2xl font-bold ${text.gradientHeading} hover:scale-105 transition-transform duration-300`}
          >
            JS Cheat Sheet
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10" role="navigation" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.type}
                to={item.path}
                className={navLink.desktop}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.type}
                  to={item.path}
                  onClick={closeMenu}
                  className={navLink.mobile}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
