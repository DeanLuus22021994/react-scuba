import { AcademicCapIcon, CameraIcon, MapIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: AcademicCapIcon,
    title: 'PADI Courses',
    description: 'Get certified with our comprehensive PADI courses from beginner to professional level',
    link: '/courses',
    linkText: 'View Courses',
    color: 'ocean',
  },
  {
    icon: MapIcon,
    title: 'Guided Dives',
    description: "Explore Mauritius' best dive sites with our experienced instructors and dive guides",
    link: '/dive-sites',
    linkText: 'Explore Sites',
    color: 'ocean',
  },
  {
    icon: CameraIcon,
    title: 'Photo Dives',
    description: 'Capture stunning underwater moments with our specialized photography dive packages',
    link: '/gallery',
    linkText: 'View Gallery',
    color: 'ocean',
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-ocean-50 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <Link to={service.link} className="text-ocean-600 font-semibold hover:text-ocean-700 inline-flex items-center">
        {service.linkText}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const ServicesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From beginner courses to advanced certifications, we offer comprehensive scuba diving services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
