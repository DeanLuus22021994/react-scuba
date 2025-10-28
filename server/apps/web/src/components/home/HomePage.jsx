import { useState, lazy, Suspense, useCallback } from 'react';
import { trackConversion } from '../../utils/analytics';

const BookingModal = lazy(() => import('../modals/BookingModal'));
const ContactModal = lazy(() => import('../modals/ContactModal'));
import { SEO } from '../ui';
import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import SpecialOffersSection from './SpecialOffersSection';
import TestimonialsSection from './TestimonialsSection';
import VideoSection from './VideoSection';

const HomePage = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleBookClick = useCallback(() => {
    trackConversion('home_hero_booking_click', { source: 'hero_section' });
    setIsBookingModalOpen(true);
  }, []);

  const handleContactClick = useCallback(() => {
    trackConversion('home_cta_contact_click', { source: 'cta_section' });
    setIsContactModalOpen(true);
  }, []);

  return (
    <>
      <SEO page="home" />
      <HeroSection onBookClick={handleBookClick} />
      <FeaturesSection />
      <SpecialOffersSection />
      <ServicesSection />
      <VideoSection />
      <TestimonialsSection />
      <CTASection onContactClick={handleContactClick} /> {/* Modals */}
      {isBookingModalOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            bookingType="dive"
            source="home_page"
          />
        </Suspense>
      )}
      {isContactModalOpen && (
        <Suspense fallback={null}>
          <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            source="home_page"
          />
        </Suspense>
      )}
    </>
  );
};

export default HomePage;
