import { AcademicCapIcon, CheckCircleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@hooks/useCurrency';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

const CourseCard = ({ course, onBookClick, index = 0 }) => {
  const [showCurriculum, setShowCurriculum] = useState(false);
  const { format } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 bg-ocean-600 text-white px-4 py-2 rounded-full font-bold shadow-md">
          {format(course.price)}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-display font-bold text-ocean-800 mb-2 tracking-tight">{course.name}</h3>
        <p className="text-gray-600 mb-4 italic">{course.tagline}</p>
        <p className="text-gray-700 mb-6">{course.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <ClockIcon className="h-5 w-5 mr-2 text-ocean-600" />
            <span className="font-semibold mr-2">Duration:</span>
            {course.duration}
          </div>
          <div className="flex items-center text-gray-700">
            <UserGroupIcon className="h-5 w-5 mr-2 text-ocean-600" />
            <span className="font-semibold mr-2">Min Age:</span>
            {course.minAge} years
          </div>
          <div className="flex items-center text-gray-700">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-ocean-600" />
            <span className="font-semibold mr-2">Certification:</span>
            {course.certification}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-ocean-800 mb-3 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            What&apos;s Included:
          </h4>
          <ul className="space-y-2">
            {course.included.map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-700 text-sm">
                <span className="text-ocean-600 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowCurriculum(!showCurriculum)}
            className="text-ocean-600 hover:text-ocean-700 font-semibold text-sm underline"
          >
            {showCurriculum ? 'Hide' : 'Show'} Curriculum
          </button>
          {showCurriculum && (
            <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
              {course.curriculum.map((item, idx) => (
                <li key={idx} className="flex items-start text-gray-700 text-sm">
                  <span className="text-ocean-600 mr-2">→</span>
                  {item}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={() => onBookClick(course)}
            className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Book {course.name}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    minAge: PropTypes.number.isRequired,
    certification: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    included: PropTypes.arrayOf(PropTypes.string).isRequired,
    curriculum: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onBookClick: PropTypes.func.isRequired,
  index: PropTypes.number,
};

export default CourseCard;
