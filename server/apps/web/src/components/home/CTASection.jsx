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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book the Diving Holiday of Your Life?
          </h2>
          <p className="text-xl md:text-2xl text-ocean-100 mb-8">
            Ready to explore the underwater world? Book your dive or course today and let&apos;s
            make memories!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onContactClick}
              className="bg-white text-ocean-600 hover:bg-ocean-50 font-bold text-lg px-10 py-4 rounded-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
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
