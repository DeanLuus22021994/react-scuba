import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    location: 'United Kingdom',
    rating: 5,
    text: "From the day I arrived, I was among friends! Ocean Spirit's patient instructors made my Open Water course amazing. The dive sites around Northern Mauritius are absolutely breathtaking!",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'David Chen',
    location: 'Singapore',
    rating: 5,
    text: 'Best dive center in Pereybere! The coffee shop is great, the facilities are comfortable, and the staff really knows their fish. Love the club-like atmosphere and commitment to conservation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Emma Laurent',
    location: 'France',
    rating: 5,
    text: 'Completed my Advanced certification with Ocean Spirit - fantastic experience! PADI 5 Star ECO Centre with Green Star. The team promotes conservation, respect, and family values. Will definitely return!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full flex flex-col bg-white p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <div className="font-bold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">{testimonial.location}</div>
        </div>
      </div>

      <div className="flex mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-700 italic flex-grow">&quot;{testimonial.text}&quot;</p>
    </motion.div>
  );
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Divers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of satisfied divers who have experienced the magic of underwater Mauritius
            with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
