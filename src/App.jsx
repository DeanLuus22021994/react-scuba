import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { CurrencyProvider } from './hooks/useCurrency';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import DiveSitesPage from './pages/DiveSitesPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <HelmetProvider>
            <CurrencyProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="about" element={<AboutPage />} />
                            <Route path="dive-sites" element={<DiveSitesPage />} />
                            <Route path="courses" element={<CoursesPage />} />
                            <Route path="gallery" element={<GalleryPage />} />
                        </Route>
                    </Routes>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </Router>
            </CurrencyProvider>
        </HelmetProvider>
    );
}

export default App;
