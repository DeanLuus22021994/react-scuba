import { motion } from 'framer-motion';

const VideoSection = () => {
  return (
    <section className="py-16 px-4 bg-ocean-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Ocean Spirit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our video to see the beauty of Mauritius underwater and learn about our PADI 5
            Star diving experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative pb-[56.25%] h-0 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl"
        >
          <iframe
            src="https://www.youtube.com/embed/jCvQJ9qAZik"
            title="Ocean Spirit Scuba Diving Mauritius Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
