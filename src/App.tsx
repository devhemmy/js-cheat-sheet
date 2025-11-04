import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './LandingPage.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import JavaScriptPage from './components/JavaScriptPage';

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path='/javascript/:topic' element={<JavaScriptPage />} />
          <Route path='/javascript' element={<JavaScriptPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
