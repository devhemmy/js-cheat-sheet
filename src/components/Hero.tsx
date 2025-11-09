import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.JAVASCRIPT);
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease]">
          Prepare for your next interview
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease_0.2s_backwards]">
          Your one-stop resource for JavaScript, TypeScript, and React interview
          preparation.
        </p>
        <button
          onClick={handleGetStarted}
          className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.8s_ease_0.4s_backwards]"
          aria-label="Get started with JavaScript cheat sheet"
        >
          Get Started
          <svg
            className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
