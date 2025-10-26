import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout Components (loaded immediately - needed for all routes)
import Footer from './layouts/Footer';
import Header from './layouts/Header';

// Shared Components (loaded immediately - used across app)
import Loading from './components/common/Loading';
import WhatsAppWidget from './components/common/WhatsAppWidget';
import BackToTop from './components/shared/BackToTop';
import ScrollProgress from './components/shared/ScrollProgress';

// Context Providers
import { CurrencyProvider } from './hooks/useCurrency';
import { QueryProvider } from './providers/QueryProvider';

// Utilities
import { initScrollReveal } from './utils/scrollToAnchor';

// Lazy-loaded Pages (code-split by route)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const DiveSitesPage = lazy(() => import('./pages/DiveSitesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

function App() {
  // Initialize scroll reveal animations on mount
  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <QueryProvider>
      <CurrencyProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <ScrollProgress />
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/dive-sites" element={<DiveSitesPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <BackToTop showAfter={400} position="right" />
            <WhatsAppWidget />
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
      </CurrencyProvider>
    </QueryProvider>
  );
}

export default App;
