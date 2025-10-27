import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FEATURES = [
  {
    title: 'PADI 5 Star ECO',
    description: 'Green Fins with Green Star',
    stat: '5★',
  },
  {
    title: 'Dive Sites',
    description: 'Around Northern Mauritius',
    stat: '65',
  },
  {
    title: 'Own Facility',
    description: 'Opened March 2020',
    stat: '2020',
  },
  {
    title: 'Coffee Shop',
    description: 'Breakfast Bar & Ocean Views',
    stat: '☕',
  },
];

const FeatureItem = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 rounded-xl bg-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="text-5xl md:text-6xl font-bold text-ocean-600 mb-3">{feature.stat}</div>
      <div className="text-xl font-display font-semibold text-gray-900 mb-2 tracking-tight">
        {feature.title}
      </div>
      <div className="text-sm text-gray-600 leading-relaxed">{feature.description}</div>
    </motion.div>
  );
};

FeatureItem.propTypes = {
  feature: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stat: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-ocean-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re committed to providing the best diving experience with safety,
            professionalism, and passion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureItem key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
