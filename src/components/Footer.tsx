const Footer = () => {
  return (
    <footer className="mt-auto bg-white/5 backdrop-blur-xl border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white/70">
          <p className="text-sm sm:text-base">
            Built with ❤️ for interview preparation • {new Date().getFullYear()}
          </p>
          <p className="text-xs sm:text-sm mt-2 text-white/50">
            JavaScript • TypeScript • React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
