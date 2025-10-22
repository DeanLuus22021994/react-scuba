import { motion } from 'framer-motion';
import { useState } from 'react';
import { DIVE_SITES } from '../../data/diveSites';
import { trackConversion } from '../../utils/analytics';
import SEO from '../common/SEO';
import BookingModal from '../modals/BookingModal';
import DiveMap from './DiveMap';
import DiveSiteCard from './DiveSiteCard';

const DiveSitesPage = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredSites =
    selectedDifficulty === 'All'
      ? DIVE_SITES
      : DIVE_SITES.filter((site) => site.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase()));

  const handleBookDive = (site) => {
    trackConversion('dive_site_booking_click', {
      site_name: site.name,
      site_id: site.id,
      difficulty: site.difficulty,
    });
    setSelectedSite(site);
    setIsBookingModalOpen(true);
  };

  const handleMarkerClick = (site) => {
    setSelectedSite(site);
    trackConversion('dive_site_map_click', {
      site_name: site.name,
      site_id: site.id,
    });
  };

  return (
    <>
      <SEO
        title="Dive Sites in Mauritius - Best Diving Locations & Maps"
        description="Explore the best dive sites in Mauritius including Blue Bay Marine Park, The Cathedral, Coin de Mire, and more. Interactive maps, marine life guides, and dive site details."
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920)',
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
              Dive Sites of Mauritius
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-ocean-100 max-w-3xl mx-auto"
            >
              Discover spectacular underwater locations around the island
            </motion.p>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-4">Explore Our Dive Locations</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                Click on markers to learn more about each dive site. We dive at the best locations around Mauritius.
              </p>
            </motion.div>

            <DiveMap selectedSite={selectedSite} onMarkerClick={handleMarkerClick} />
          </div>
        </section>

        {/* Dive Sites Grid */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-4">Featured Dive Sites</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                Filter by difficulty level to find the perfect dive for your experience
              </p>

              {/* Difficulty Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedDifficulty === difficulty
                        ? 'bg-ocean-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-ocean-50 hover:text-ocean-600'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSites.map((site, index) => (
                <DiveSiteCard key={site.id} site={site} onBookClick={handleBookDive} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6">Ready to Explore These Amazing Sites?</h2>
              <p className="text-lg text-gray-700 mb-8">
                Join us for an unforgettable diving experience at any of these spectacular locations. Our experienced guides know each site
                intimately and will ensure you have a safe, memorable dive.
              </p>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Book Your Dive Today
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} bookingType="dive" source="dive_sites_page" />
    </>
  );
};

export default DiveSitesPage;
