import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Pages
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import DiveSitesPage from './pages/DiveSitesPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';

// Layout Components
import Footer from './layouts/Footer';
import Header from './layouts/Header';

// Shared Components
import BackToTop from './components/shared/BackToTop';
import ScrollProgress from './components/shared/ScrollProgress';

// Utilities
import { initScrollReveal } from './utils/scrollToAnchor';

function App() {
    // Initialize scroll reveal animations on mount
    useEffect(() => {
        initScrollReveal();
    }, []);

    return (
        <Router>
            <div className="App min-h-screen flex flex-col">
                <ScrollProgress />
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/dive-sites" element={<DiveSitesPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                    </Routes>
                </main>
                <Footer />
                <BackToTop showAfter={400} position="right" />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#1f2937',
                        },
                        success: {
                            iconTheme: {
                                primary: '#0e7490',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </div>
        </Router>
    );
}

export default App;
