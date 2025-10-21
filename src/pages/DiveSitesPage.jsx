import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import SEO from '../components/common/SEO';
import BookingModal from '../components/modals/BookingModal';
import { trackEvent } from '../utils/analytics';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DIVE_SITES = [
  {
    id: 'blue-bay',
    name: 'Blue Bay Marine Park',
    coordinates: [-20.4453, 57.7089],
    depth: '5-12m',
    visibility: 'Excellent (20-30m)',
    difficulty: 'Beginner',
    marineLife: ['Parrotfish', 'Butterflyfish', 'Sea turtles', 'Moray eels', 'Coral gardens'],
    description: 'A stunning marine park with crystal-clear waters and vibrant coral reefs. Perfect for beginners and snorkelers.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    highlights: ['Protected marine park', 'Shallow reef perfect for training', 'Abundant marine life'],
  },
  {
    id: 'cathedral',
    name: 'The Cathedral',
    coordinates: [-20.2897, 57.4531],
    depth: '18-30m',
    visibility: 'Very Good (15-25m)',
    difficulty: 'Intermediate',
    marineLife: ['Lobsters', 'Groupers', 'Octopus', 'Nudibranchs', 'Reef sharks'],
    description: 'An impressive underwater cave system with cathedral-like formations. Light beams penetrate through openings creating magical effects.',
    bestSeason: 'May to December',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    highlights: ['Dramatic cave formations', 'Light beam displays', 'Advanced navigation challenge'],
  },
  {
    id: 'coin-de-mire',
    name: 'Coin de Mire',
    coordinates: [-19.8786, 57.8683],
    depth: '15-40m',
    visibility: 'Excellent (25-35m)',
    difficulty: 'Advanced',
    marineLife: ['Barracudas', 'Tuna', 'Dolphins', 'Manta rays', 'Whale sharks (seasonal)'],
    description: 'An iconic island off the north coast with dramatic walls and pelagic action. One of Mauritius\'s most spectacular dive sites.',
    bestSeason: 'October to April',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    highlights: ['Big fish encounters', 'Drift diving opportunities', 'Dramatic underwater topography'],
  },
  {
    id: 'whale-rock',
    name: 'Whale Rock',
    coordinates: [-20.1253, 57.7342],
    depth: '20-35m',
    visibility: 'Very Good (18-28m)',
    difficulty: 'Intermediate',
    marineLife: ['Sea turtles', 'Eagle rays', 'Snappers', 'Sweetlips', 'Nudibranchs'],
    description: 'A massive rock formation rising from the seabed, covered in hard and soft corals with plenty of swim-throughs.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    highlights: ['Unique rock formations', 'Multiple swim-throughs', 'Excellent for underwater photography'],
  },
  {
    id: 'holts-rocks',
    name: 'Holt\'s Rocks',
    coordinates: [-20.1875, 57.6894],
    depth: '12-25m',
    visibility: 'Good (15-20m)',
    difficulty: 'Beginner to Intermediate',
    marineLife: ['Clownfish', 'Lionfish', 'Trumpetfish', 'Scorpionfish', 'Batfish'],
    description: 'A series of rocky outcrops with diverse marine life and excellent for macro photography.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
    highlights: ['Macro photography paradise', 'Diverse fish species', 'Multiple dive levels available'],
  },
];

const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

// Component to fly to selected marker
function ChangeMapView({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 13, { duration: 1.5 });
  }
  return null;
}

const DiveSitesPage = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDiveSite, setBookingDiveSite] = useState(null);

  const filteredSites = useMemo(() => {
    if (filterDifficulty === 'All') return DIVE_SITES;
    return DIVE_SITES.filter(site => site.difficulty === filterDifficulty);
  }, [filterDifficulty]);

  const handleBookDive = (site) => {
    trackEvent('dive_site_booking_click', {
      site_name: site.name,
      site_id: site.id,
      difficulty: site.difficulty,
    });
    setBookingDiveSite(site);
    setIsBookingModalOpen(true);
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    trackEvent('dive_site_view', {
      site_name: site.name,
      site_id: site.id,
    });
  };

  // Mauritius center coordinates
  const mauritiusCenter = [-20.348404, 57.552152];

  return (
    <>
      <SEO
        title="Dive Sites in Mauritius - Explore the Best Underwater Locations"
        description="Discover Mauritius's top dive sites including Blue Bay Marine Park, Cathedral, Coin de Mire, Whale Rock, and Holt's Rocks. Dive sites for all experience levels with detailed maps and marine life information."
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
              Dive Sites in Mauritius
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto"
            >
              Explore the underwater wonders of the Indian Ocean
            </motion.p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <span className="font-semibold text-gray-700">Filter by difficulty:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setFilterDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterDifficulty === difficulty
                      ? 'bg-ocean-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8 px-4 bg-ocean-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '500px' }}>
              <MapContainer
                center={mauritiusCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredSites.map((site) => (
                  <Marker
                    key={site.id}
                    position={site.coordinates}
                    eventHandlers={{
                      click: () => handleSiteSelect(site),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{site.description}</p>
                        <p className="text-sm">
                          <strong>Depth:</strong> {site.depth}
                        </p>
                        <p className="text-sm">
                          <strong>Difficulty:</strong> {site.difficulty}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {selectedSite && <ChangeMapView coords={selectedSite.coordinates} />}
              </MapContainer>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Click on markers to view dive site details • Scroll to zoom
            </p>
          </div>
        </section>

        {/* Dive Sites Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Dive Sites
              </h2>
              <p className="text-lg text-gray-700">
                {filteredSites.length} dive site{filteredSites.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredSites.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-64">
                    <img
                      src={site.image}
                      alt={site.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${DIFFICULTY_COLORS[site.difficulty]}`}>
                        {site.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{site.name}</h3>
                    <p className="text-gray-700 mb-4">{site.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Depth</p>
                        <p className="text-ocean-600 font-semibold">{site.depth}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Visibility</p>
                        <p className="text-ocean-600 font-semibold">{site.visibility}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Best Season</p>
                        <p className="text-ocean-600 font-semibold">{site.bestSeason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Difficulty</p>
                        <p className="text-ocean-600 font-semibold">{site.difficulty}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Highlights</p>
                      <ul className="space-y-1">
                        {site.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-ocean-600 mr-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Marine Life</p>
                      <div className="flex flex-wrap gap-2">
                        {site.marineLife.map((species, idx) => (
                          <span
                            key={idx}
                            className="bg-ocean-50 text-ocean-700 text-xs px-2 py-1 rounded"
                          >
                            {species}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSiteSelect(site)}
                        className="flex-1 px-4 py-2 border border-ocean-600 text-ocean-600 font-semibold rounded-lg hover:bg-ocean-50 transition-colors"
                      >
                        View on Map
                      </button>
                      <button
                        onClick={() => handleBookDive(site)}
                        className="flex-1 btn-primary"
                      >
                        Book Dive
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-ocean-600 to-cyan-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Explore These Dive Sites?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8"
            >
              Book a guided dive with our experienced instructors
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-white text-ocean-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Book a Dive
            </motion.button>
          </div>
        </section>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingDiveSite(null);
        }}
        bookingType="dive"
        source={bookingDiveSite ? `dive_sites_${bookingDiveSite.id}` : 'dive_sites_page'}
      />
    </>
  );
};

export default DiveSitesPage;
