import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

/**
 * BackToTop Component
 * Floating button that appears on scroll and returns user to top of page
 *
 * @component
 * @param {number} showAfter - Scroll distance in pixels before showing button (default: 300)
 * @param {string} position - Position of button: 'right' or 'left' (default: 'right')
 */
export default function BackToTop({ showAfter = 300, position = 'right' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > showAfter);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const positionClasses = position === 'left' ? 'left-6' : 'right-6';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`fixed bottom-6 ${positionClasses} z-50 p-3 bg-ocean-600 text-white rounded-full shadow-lg
            hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2`}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

BackToTop.propTypes = {
  showAfter: PropTypes.number,
  position: PropTypes.oneOf(['left', 'right']),
};
