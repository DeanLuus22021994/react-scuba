import { SEO } from '@components/ui';
import { CREDENTIALS } from '@config/constants/CREDENTIALS';
import { TEAM_MEMBERS } from '@config/constants/TEAM';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { trackConversion } from '@utils/analytics';
import { motion } from 'framer-motion';
import { useState } from 'react';
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920)',
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6 text-center">The Ocean Spirit New Dive Centre</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Ocean Spirit Scuba Diving, together with Ocean Spirit Training and the Ocean Spirit Coffee Shop and Breakfast Bar are
                  proudly housed in our own building with a gorgeous view of the ocean we love. Opened on 2 March 2020, this is the perfect
                  solution to a scuba diving holiday in the North in Mauritius.
                </p>
                <p>
                  The Diving centre offers hospitality, comprehensive gear selection, personal mouthpieces, and careful disinfectant gear
                  rinsing. For the duration of your visit your gear is reserved for your exclusive use. The Coffee shop offers everything a
                  diver could wish for in the line of food, beverages, snacks, beach barbecues, catered functions and of course superb
                  Coffee.
                </p>
                <p>
                  Our patient skilled PADI Instructors focus on safety, they know their fish and love their world. Diving Mauritius is in
                  warm water, with good visibility and 65 great dive sites around the Northern Mauritius Islands. Wreck diving, Turtle
                  diving, Shark diving, macro photography, deep diving, and exquisite healthy coral reefs.
                </p>
                <p>
                  Because that&apos;s what diving is all about. Going places, making friends and sharing experiences. Why not join us? And
                  book the diving holiday of your life.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-12 text-center">Our Mission & Values</h2>
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
                  Your safety is our top priority. We maintain the highest equipment standards and follow strict safety protocols on every
                  dive.
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
                  We believe in quality education. Our instructors use proven teaching methods to help you become a confident, skilled
                  diver.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conservation & Family Values</h3>
                <p className="text-gray-700">
                  Ocean Spirit has grown in its commitment to promote conservation, humility, respect, family values and career development
                  for our team and community.
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
              <p className="text-lg text-gray-700">Trusted, certified, and recognized for excellence</p>
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
              <p className="text-lg text-gray-700">Experienced, passionate, and dedicated to your diving success</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6">Modern Equipment & Safety Record</h2>
            <p className="text-lg text-gray-700 mb-8">
              We invest in the best equipment to ensure your comfort and safety. All our gear is professionally maintained and regularly
              serviced to manufacturer specifications.
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
          </div>
        </section>

        {/* Water Conditions & Climate */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-12 text-center">Perfect Diving Conditions Year-Round</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <svg className="w-12 h-12 text-orange-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900">Summer (October - April)</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Air Temperature:</span>
                    <span className="text-ocean-600 font-bold text-lg">28°C - 35°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Water Temperature:</span>
                    <span className="text-ocean-600 font-bold text-lg">26°C - 29°C</span>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Warm tropical conditions with excellent visibility. Perfect for extended dive sessions and minimal exposure protection
                    needed.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <svg className="w-12 h-12 text-cyan-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900">Winter (May - September)</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Air Temperature:</span>
                    <span className="text-ocean-600 font-bold text-lg">18°C - 28°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Water Temperature:</span>
                    <span className="text-ocean-600 font-bold text-lg">23°C - 25°C</span>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Mild comfortable weather with great diving conditions. A 3mm wetsuit recommended. Excellent time for marine life
                    encounters.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Mauritius offers fantastic diving conditions throughout the year. With warm waters, abundant marine life, and excellent
                visibility averaging 20-30 meters, Northern Mauritius is a diver&apos;s paradise no matter when you visit.
              </p>
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-16 px-4 bg-ocean-600 text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Special Packages</h2>
            <p className="text-ocean-100 text-lg mb-12 text-center max-w-2xl mx-auto">
              Exclusive offers designed to give you the best diving experience in Mauritius
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-ocean-800">Couples DSD Special</h3>
                  <div className="bg-ocean-600 text-white px-4 py-2 rounded-full font-bold">2 for 1</div>
                </div>
                <p className="text-gray-700 mb-6">
                  Perfect for couples wanting to discover scuba diving together! Experience your first breath underwater as a team with
                  personalized instruction and full equipment included.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Professional PADI instructor</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>All equipment provided</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Dive to 12 meters depth</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Create unforgettable memories together</span>
                  </li>
                </ul>
                <button
                  onClick={handleBookingClick}
                  className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Book Couples DSD
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-ocean-800">Best of North Package</h3>
                  <div className="bg-ocean-600 text-white px-4 py-2 rounded-full font-bold">MUR 20,000</div>
                </div>
                <p className="text-gray-700 mb-6">
                  Explore 10 of the best dive sites in Northern Mauritius! Perfect for certified divers wanting to experience the incredible
                  diversity of our underwater world.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>10 guided dives at premium sites</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Coin de Mire, Trou Aux Biches & more</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Wreck diving & turtle encounters</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-ocean-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Best value for multiple dives</span>
                  </li>
                </ul>
                <button
                  onClick={handleBookingClick}
                  className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Book Best of North
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
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
