import { CurrencyDollarIcon, GiftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { OCEAN_SPIRIT_CONTENT as oceanSpiritContent } from '../../config/constants/OCEAN_SPIRIT';

const SpecialOffersSection = () => {
  const handleEmailOffer = (subject) => {
    window.location.href = `mailto:info@osdiving.com?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-ocean-50 via-white to-ocean-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">
            Scuba Diving Special Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Exclusive packages designed to give you the best diving experience in Mauritius
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Discover Scuba Diving */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 overflow-hidden border border-ocean-100"
          >
            <div className="bg-gradient-to-r from-ocean-600 to-ocean-700 p-6 text-white">
              <div className="flex items-center mb-2">
                <GiftIcon className="w-6 h-6 mr-2" />
                <span className="text-sm font-semibold uppercase tracking-wide">Special Offer</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">PADI Discover Scuba Diving</h3>
              <p className="text-ocean-100">Step one of your PADI Open Water Certification</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {oceanSpiritContent.offers[0].description}
              </p>
              <div className="bg-ocean-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-ocean-800 mb-2">
                  ✨ Couples DSD Special Available
                </p>
                <p className="text-sm text-gray-600">
                  Perfect for beginners - no experience required!
                </p>
              </div>
              <button
                onClick={() => handleEmailOffer(oceanSpiritContent.offers[0].emailSubject)}
                className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Click here to Discover Scuba Diving
              </button>
            </div>
          </motion.div>

          {/* Best of the North Package */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 overflow-hidden border border-ocean-100"
          >
            <div className="bg-gradient-to-r from-ocean-700 to-ocean-800 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 mr-2" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Best Value</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-lg font-bold">{oceanSpiritContent.offers[1].price}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Best of the North</h3>
              <p className="text-ocean-100">10 Dive Package</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {oceanSpiritContent.offers[1].description}
              </p>
              <div className="bg-ocean-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-ocean-800 mb-2">Package Includes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {oceanSpiritContent.offers[1].includes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-4 h-4 text-ocean-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleEmailOffer(oceanSpiritContent.offers[1].emailSubject)}
                className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Click here for information on how to book
              </button>
            </div>
          </motion.div>
        </div>

        {/* Temperature Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-ocean-800 mb-4 text-center">
              Temperature in Mauritius °C
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Summer ({oceanSpiritContent.temperature.summer.air.months})
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Air Temperature:</span>{' '}
                    {oceanSpiritContent.temperature.summer.air.range}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Water Temperature:</span>{' '}
                    {oceanSpiritContent.temperature.summer.water.range}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Winter ({oceanSpiritContent.temperature.winter.air.months})
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Air Temperature:</span>{' '}
                    {oceanSpiritContent.temperature.winter.air.range}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Water Temperature:</span>{' '}
                    {oceanSpiritContent.temperature.winter.water.range}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
