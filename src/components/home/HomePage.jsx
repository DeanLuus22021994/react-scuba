import { useState } from 'react';
import { trackConversion } from '../../utils/analytics';
import SEO from '../common/SEO';
import BookingModal from '../modals/BookingModal';
import ContactModal from '../modals/ContactModal';
import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
import VideoSection from './VideoSection';

const HomePage = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleBookClick = () => {
    trackConversion('home_hero_booking_click', { source: 'hero_section' });
    setIsBookingModalOpen(true);
  };

  const handleContactClick = () => {
    trackConversion('home_cta_contact_click', { source: 'cta_section' });
    setIsContactModalOpen(true);
  };

  return (
    <>
      <SEO page="home" />
      <HeroSection onBookClick={handleBookClick} />
      <FeaturesSection />
      <ServicesSection />
      <VideoSection />
      <TestimonialsSection />
      <CTASection onContactClick={handleContactClick} /> {/* Modals */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} bookingType="dive" source="home_page" />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} source="home_page" />
    </>
  );
};

export default HomePage;
