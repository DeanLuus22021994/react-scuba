import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CTASection = ({ onContactClick }) => {
  return (
    <section className="py-16 px-4 bg-ocean-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book the Diving Holiday of Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-ocean-50">
            Going places, making friends and sharing experiences - that's what diving is all about. Join Ocean Spirit in Pereybere for
            unforgettable underwater adventures in Northern Mauritius!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onContactClick}
              className="bg-white text-ocean-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Contact Us Today
            </button>
            <a
              href="tel:+2302634468"
              className="bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-lg px-8 py-4 rounded-lg border-2 border-white/30 transition-all"
            >
              Call +230 263 44 68
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

CTASection.propTypes = {
  onContactClick: PropTypes.func.isRequired,
};

export default CTASection;
