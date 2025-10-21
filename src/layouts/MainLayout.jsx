import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WhatsAppButton } from '../components/common';
import { trackPageView } from '../utils/analytics';
import Footer from './Footer';
import Header from './Header';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname, document.title);

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton source="floating_button" variant="floating" />
    </div>
  );
};

export default MainLayout;
