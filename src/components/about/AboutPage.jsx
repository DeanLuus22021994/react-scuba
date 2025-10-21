import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { CREDENTIALS } from '../../data/credentials';
import { TEAM_MEMBERS } from '../../data/team';
import { trackConversion } from '../../utils/analytics';
import SEO from '../common/SEO';
import BookingModal from '../modals/BookingModal';
import CredentialCard from './CredentialCard';
import TeamMember from './TeamMember';

const AboutPage = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookingClick = () => {
    trackConversion('about_page_cta', { action: 'book_discovery_dive' });
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <SEO
        title="About Us - Expert Scuba Diving Team in Mauritius"
        description="Meet our team of certified PADI instructors with 50+ years combined experience. PADI 5 Star Dive Center offering professional diving courses and guided dives in Mauritius."
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/80 to-ocean-600/80" />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              About Our Dive Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-ocean-100 max-w-3xl mx-auto"
            >
              Passion, Professionalism, and Safety Since 2013
            </motion.p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Founded in 2013, we started with a simple mission: to share the incredible
                  underwater world of Mauritius with adventurers from around the globe. What began
                  as a small operation with two instructors has grown into one of the island's most
                  respected dive centers.
                </p>
                <p>
                  Our PADI 5 Star rating reflects our commitment to excellence in training, safety,
                  and customer service. Every member of our team is passionate about diving and
                  dedicated to ensuring your underwater experience is safe, educational, and
                  unforgettable.
                </p>
                <p>
                  With over 10 years of operations and zero major incidents, we've established
                  ourselves as the trusted choice for both beginners taking their first breaths
                  underwater and experienced divers seeking new adventures in Mauritian waters.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-12 text-center">
              Our Mission & Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-ocean-600 mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-700">
                  Your safety is our top priority. We maintain the highest equipment standards and
                  follow strict safety protocols on every dive.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-ocean-600 mb-4">
                  <AcademicCapIcon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Education Excellence</h3>
                <p className="text-gray-700">
                  We believe in quality education. Our instructors use proven teaching methods to
                  help you become a confident, skilled diver.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-ocean-600 mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marine Conservation</h3>
                <p className="text-gray-700">
                  We're dedicated to protecting our oceans. Through education and responsible diving
                  practices, we work to preserve marine ecosystems.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Credentials</h2>
              <p className="text-lg text-gray-700">
                Trusted, certified, and recognized for excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CREDENTIALS.map((credential, index) => (
                <CredentialCard key={index} credential={credential} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-ocean-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-700">
                Experienced, passionate, and dedicated to your diving success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM_MEMBERS.map((member, index) => (
                <TeamMember key={index} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Equipment & Safety */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6">
              Modern Equipment & Safety Record
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We invest in the best equipment to ensure your comfort and safety. All our gear is
              professionally maintained and regularly serviced to manufacturer specifications.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-ocean-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-ocean-600 mb-2">10+</div>
                <p className="text-gray-700">Years of Safe Operations</p>
              </div>
              <div className="bg-ocean-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-ocean-600 mb-2">5000+</div>
                <p className="text-gray-700">Successful Dives</p>
              </div>
              <div className="bg-ocean-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-ocean-600 mb-2">Zero</div>
                <p className="text-gray-700">Major Incidents</p>
              </div>
            </div>
            <button
              onClick={handleBookingClick}
              className="bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Book Your Discovery Dive
            </button>
          </div>
        </section>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingType="course"
        preSelectedItem={{ id: 'discover-scuba', name: 'Discover Scuba Diving' }}
        source="about_page"
      />
    </>
  );
};

export default AboutPage;
