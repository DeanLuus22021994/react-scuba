import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FEATURES = [
  {
    title: 'PADI 5 Star Certified',
    description: 'Highest quality training standards',
    stat: '5★',
  },
  {
    title: 'Years of Experience',
    description: 'Established dive center since 2013',
    stat: '10+',
  },
  {
    title: 'Successful Dives',
    description: 'Safe and memorable experiences',
    stat: '5000+',
  },
  {
    title: 'Perfect Safety Record',
    description: 'Zero major incidents',
    stat: '100%',
  },
];

const FeatureItem = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-ocean-600 mb-2">{feature.stat}</div>
      <div className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</div>
      <div className="text-sm text-gray-600">{feature.description}</div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing the best diving experience with safety,
            professionalism, and passion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureItem key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
