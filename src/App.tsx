import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load the JavaScriptPage component for better performance
const JavaScriptPage = lazy(() => import('./components/JavaScriptPage'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col">
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path='/' element={<Hero />} />
            <Route path='/javascript/:topic' element={<JavaScriptPage />} />
            <Route path='/javascript' element={<JavaScriptPage />} />
            <Route path='/typescript/:topic' element={<JavaScriptPage />} />
            <Route path='/typescript' element={<JavaScriptPage />} />
            <Route path='*' element={
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-4">404</h1>
                  <p className="text-xl text-white/60 mb-8">Page not found</p>
                  <a href="/" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full hover:shadow-lg transition-all duration-300">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
