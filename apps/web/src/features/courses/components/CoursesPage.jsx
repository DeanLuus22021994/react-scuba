import { motion } from 'framer-motion';
import { useState } from 'react';
import BookingModal from '../../../components/modals/BookingModal';
import ContactModal from '../../../components/modals/ContactModal';
import { SEO } from '../../../components/ui';
import { COURSES } from '../../../config/constants/COURSES';
import { useCurrency } from '../../../hooks/useCurrency';
import { trackCourseInquiry } from '../../../utils/analytics';
import CourseCard from './CourseCard';
import CourseComparison from './CourseComparison';

const CoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { currency, convert } = useCurrency();

  const handleBookCourse = (course) => {
    trackCourseInquiry(course.name, convert(course.price, 'MUR', currency), currency);
    setSelectedCourse(course);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <SEO
        title="PADI Scuba Diving Courses in Mauritius - From Beginner to Professional"
        description="Professional PADI scuba diving courses in Mauritius. Discover Scuba Diving, Open Water, Advanced, Rescue Diver, and Divemaster certification. Experienced instructors, small groups, best prices."
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/80 to-ocean-600/80" />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              PADI Diving Courses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-ocean-100 max-w-3xl mx-auto"
            >
              From your first breath underwater to professional dive leader
            </motion.p>
          </div>
        </section>

        {/* Course Cards */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-4">
                Choose Your Course
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Whether you&apos;re taking your first breath underwater or training to become a
                professional, we have the perfect course for you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {COURSES.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onBookClick={handleBookCourse}
                  index={index}
                />
              ))}
            </div>

            {/* Course Comparison Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <CourseComparison />
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 text-center bg-ocean-600 text-white p-12 rounded-lg"
            >
              <h3 className="text-3xl font-bold mb-4">Not Sure Which Course is Right for You?</h3>
              <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
                Contact our experienced instructors for personalized course recommendations based on
                your goals and experience level.
              </p>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-white text-ocean-600 hover:bg-ocean-50 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Get Course Advice
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingType="course"
        preSelectedItem={selectedCourse}
        source="courses_page"
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialSubject={selectedCourse ? `Inquiry about ${selectedCourse.name}` : 'Course Inquiry'}
        source="courses_page"
        inquiryType="Course Information"
      />
    </>
  );
};

export default CoursesPage;
