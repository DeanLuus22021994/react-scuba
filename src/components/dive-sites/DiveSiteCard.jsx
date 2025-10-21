import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { DIFFICULTY_COLORS } from '../../data/diveSites';

const DiveSiteCard = ({ site, onBookClick, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={site.image}
          alt={site.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div
          className={`absolute top-4 right-4 ${DIFFICULTY_COLORS[site.difficulty]} px-4 py-2 rounded-full font-bold text-sm`}
        >
          {site.difficulty}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-ocean-800 mb-3">{site.name}</h3>
        <p className="text-gray-700 mb-4">{site.description}</p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Depth:</span>
            <span className="text-gray-600">{site.depth}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Visibility:</span>
            <span className="text-gray-600">{site.visibility}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-700">Best Season:</span>
            <span className="text-gray-600">{site.bestSeason}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Highlights:</h4>
          <ul className="space-y-1">
            {site.highlights.map((highlight, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start">
                <span className="text-ocean-600 mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Marine Life:</h4>
          <div className="flex flex-wrap gap-2">
            {site.marineLife.map((species, idx) => (
              <span key={idx} className="bg-ocean-50 text-ocean-700 px-3 py-1 rounded-full text-xs">
                {species}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBookClick(site)}
          className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Book Dive at {site.name}
        </button>
      </div>
    </motion.div>
  );
};

DiveSiteCard.propTypes = {
  site: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    depth: PropTypes.string.isRequired,
    visibility: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    marineLife: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    bestSeason: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onBookClick: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default DiveSiteCard;
