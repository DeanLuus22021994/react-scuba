import {
    AcademicCapIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SEO from '../components/common/SEO';
import BookingModal from '../components/modals/BookingModal';
import ContactModal from '../components/modals/ContactModal';
import { useCurrency } from '../hooks/useCurrency';
import { trackEvent } from '../utils/analytics';

const COURSES = [
    {
        id: 'discover-scuba',
        name: 'Discover Scuba Diving',
        tagline: 'Try diving for the first time',
        price: 4500,
        duration: '1 day',
        minAge: 10,
        prerequisites: 'None - No experience required',
        maxDepth: '12m',
        certification: 'Experience recognition (not full certification)',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        description: 'Your first adventure underwater! Experience the thrill of scuba diving in a controlled environment with expert supervision.',
        included: [
            'Theory session and safety briefing',
            'Confined water practice session',
            'Open water dive (up to 12m)',
            'All equipment rental',
            'PADI instructor supervision',
            'Recognition certificate',
        ],
        curriculum: [
            'Basic scuba diving principles',
            'Equipment familiarization',
            'Underwater breathing techniques',
            'Safety procedures',
            'Marine life awareness',
        ],
    },
    {
        id: 'open-water',
        name: 'Open Water Diver',
        tagline: 'Become a certified diver',
        price: 15000,
        duration: '3-4 days',
        minAge: 10,
        prerequisites: 'None - No experience required',
        maxDepth: '18m',
        certification: 'PADI Open Water Diver',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        description: 'The world\'s most popular scuba certification. Learn to dive independently with a buddy to a maximum depth of 18 meters.',
        included: [
            'PADI eLearning or classroom sessions',
            '5 confined water training dives',
            '4 open water certification dives',
            'All equipment rental during course',
            'PADI certification and card',
            'Logbook and materials',
        ],
        curriculum: [
            'Dive equipment and physics',
            'Buoyancy control mastery',
            'Underwater navigation',
            'Safety and emergency procedures',
            'Dive planning and execution',
            'Environmental awareness',
        ],
    },
    {
        id: 'advanced',
        name: 'Advanced Open Water Diver',
        tagline: 'Enhance your skills and explore deeper',
        price: 12000,
        duration: '2-3 days',
        minAge: 12,
        prerequisites: 'PADI Open Water Diver or equivalent',
        maxDepth: '30m',
        certification: 'PADI Advanced Open Water Diver',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
        description: 'Build confidence and expand your diving skills with underwater navigation, deep diving, and three specialty dives of your choice.',
        included: [
            'PADI eLearning or knowledge reviews',
            '5 adventure dives (including deep and navigation)',
            'Choice of 3 specialty dives',
            'All equipment rental during course',
            'PADI certification and card',
            'Dive computer training',
        ],
        curriculum: [
            'Deep diving techniques (up to 30m)',
            'Advanced navigation with compass',
            'Peak performance buoyancy',
            'Choice specialties: Wreck, Night, Photography, etc.',
            'Advanced dive planning',
        ],
    },
    {
        id: 'rescue',
        name: 'Rescue Diver',
        tagline: 'Learn to prevent and manage dive emergencies',
        price: 14000,
        duration: '3-4 days',
        minAge: 12,
        prerequisites: 'PADI Advanced Open Water Diver + EFR certification',
        maxDepth: '30m',
        certification: 'PADI Rescue Diver',
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
        description: 'Challenge yourself and expand your capabilities as a diver. Learn to identify and solve problems, and become a safer diver.',
        included: [
            'PADI eLearning or classroom sessions',
            'Rescue skill development sessions',
            'Rescue scenario practice dives',
            'Emergency First Response (EFR) course',
            'All equipment rental during course',
            'PADI certification and card',
        ],
        curriculum: [
            'Self-rescue and diver stress',
            'Emergency management',
            'Assisting responsive and unresponsive divers',
            'Missing diver procedures',
            'In-water rescue breathing',
            'Exiting divers from water',
        ],
    },
    {
        id: 'divemaster',
        name: 'Divemaster',
        tagline: 'Become a professional dive leader',
        price: 45000,
        duration: '6-8 weeks',
        minAge: 18,
        prerequisites: 'PADI Rescue Diver + 40 logged dives',
        maxDepth: '40m',
        certification: 'PADI Divemaster (Professional level)',
        image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
        description: 'Take the first step in your professional diving career. Lead dives, assist with training, and work at dive centers worldwide.',
        included: [
            'Comprehensive theory and workshops',
            'Dive skill development and workshops',
            'Practical assessment and internship',
            'Rescue skills review',
            'All training materials',
            'PADI Divemaster certification',
            'Professional liability insurance guidance',
        ],
        curriculum: [
            'Professional dive physics and physiology',
            'Dive supervision and control',
            'Assisting with training',
            'Dive site management',
            'Emergency procedures',
            'Business of diving',
            'Environmental awareness programs',
        ],
    },
];

const CoursesPage = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const { currency, convert, format } = useCurrency();

    const handleBookCourse = (course) => {
        trackEvent('course_inquiry', {
            course_name: course.name,
            course_id: course.id,
            course_price: convert(course.price, 'MUR', currency),
            currency,
        });
        setSelectedCourse(course);
        setIsBookingModalOpen(true);
    };

    const handleContactClick = (course) => {
        trackEvent('course_contact_click', {
            course_name: course.name,
            course_id: course.id,
        });
        setSelectedCourse(course);
        setIsContactModalOpen(true);
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
                            backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920)',
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
                            className="text-xl md:text-2xl max-w-3xl mx-auto"
                        >
                            From your first breath underwater to professional certification
                        </motion.p>
                    </div>
                </section>

                {/* Course Comparison Table */}
                <section className="py-16 px-4 bg-ocean-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Choose Your Path
                            </h2>
                            <p className="text-lg text-gray-700">
                                Compare our courses and find the perfect fit for your diving goals
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-lg shadow-lg">
                                <thead className="bg-ocean-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Course</th>
                                        <th className="px-6 py-4 text-left">Duration</th>
                                        <th className="px-6 py-4 text-left">Min Age</th>
                                        <th className="px-6 py-4 text-left">Max Depth</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {COURSES.map((course) => (
                                        <tr key={course.id} className="hover:bg-ocean-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{course.name}</td>
                                            <td className="px-6 py-4 text-gray-700">{course.duration}</td>
                                            <td className="px-6 py-4 text-gray-700">{course.minAge} years</td>
                                            <td className="px-6 py-4 text-gray-700">{course.maxDepth}</td>
                                            <td className="px-6 py-4 text-right font-bold text-ocean-600">
                                                {format(convert(course.price, 'MUR', currency), currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Course Details */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-12">
                            {COURSES.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                        <div className="relative h-64 lg:h-auto">
                                            <img
                                                src={course.image}
                                                alt={course.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h3 className="text-3xl font-bold mb-1">{course.name}</h3>
                                                <p className="text-lg">{course.tagline}</p>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-3xl font-bold text-ocean-600">
                                                    {format(convert(course.price, 'MUR', currency), currency)}
                                                </div>
                                                <div className="text-gray-600 flex items-center">
                                                    <ClockIcon className="w-5 h-5 mr-2" />
                                                    {course.duration}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-6">{course.description}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-ocean-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-600">Min Age</p>
                                                    <p className="font-semibold text-ocean-700">{course.minAge} years</p>
                                                </div>
                                                <div className="bg-ocean-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-600">Max Depth</p>
                                                    <p className="font-semibold text-ocean-700">{course.maxDepth}</p>
                                                </div>
                                                <div className="bg-ocean-50 p-3 rounded-lg col-span-2">
                                                    <p className="text-sm text-gray-600">Prerequisites</p>
                                                    <p className="font-semibold text-ocean-700">{course.prerequisites}</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                                    <CheckCircleIcon className="w-5 h-5 mr-2 text-ocean-600" />
                                                    What's Included
                                                </h4>
                                                <ul className="space-y-2">
                                                    {course.included.map((item, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                                            <span className="text-ocean-600 mr-2">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                                    <AcademicCapIcon className="w-5 h-5 mr-2 text-ocean-600" />
                                                    Curriculum
                                                </h4>
                                                <ul className="space-y-2">
                                                    {course.curriculum.map((item, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                                            <span className="text-ocean-600 mr-2">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleContactClick(course)}
                                                    className="flex-1 px-6 py-3 border border-ocean-600 text-ocean-600 font-semibold rounded-lg hover:bg-ocean-50 transition-colors"
                                                >
                                                    Ask a Question
                                                </button>
                                                <button
                                                    onClick={() => handleBookCourse(course)}
                                                    className="flex-1 btn-primary"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-16 px-4 bg-ocean-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Learn to Dive With Us?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white p-6 rounded-xl shadow-lg text-center"
                            >
                                <UserGroupIcon className="w-16 h-16 text-ocean-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Small Groups</h3>
                                <p className="text-gray-700">
                                    Maximum 4 students per instructor for personalized attention and safer learning
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-lg text-center"
                            >
                                <AcademicCapIcon className="w-16 h-16 text-ocean-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Instructors</h3>
                                <p className="text-gray-700">
                                    PADI professionals with years of experience and passion for teaching
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg text-center"
                            >
                                <CheckCircleIcon className="w-16 h-16 text-ocean-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Equipment</h3>
                                <p className="text-gray-700">
                                    Latest dive gear maintained to highest standards, included in course price
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-ocean-600 to-cyan-500 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold mb-6"
                        >
                            Start Your Diving Journey Today
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl mb-8"
                        >
                            Have questions? Our team is here to help you choose the right course
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            onClick={() => setIsContactModalOpen(true)}
                            className="bg-white text-ocean-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Contact Us
                        </motion.button>
                    </div>
                </section>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => {
                    setIsBookingModalOpen(false);
                    setSelectedCourse(null);
                }}
                bookingType="course"
                preSelectedItem={selectedCourse?.id}
                source={selectedCourse ? `courses_${selectedCourse.id}` : 'courses_page'}
            />

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => {
                    setIsContactModalOpen(false);
                    setSelectedCourse(null);
                }}
                inquiryType="Course Information"
                initialSubject={selectedCourse ? `Question about ${selectedCourse.name}` : ''}
                source={selectedCourse ? `courses_${selectedCourse.id}_contact` : 'courses_page_contact'}
            />
        </>
    );
};

export default CoursesPage;
