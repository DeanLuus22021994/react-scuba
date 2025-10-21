import {
    AcademicCapIcon,
    ShieldCheckIcon,
    TrophyIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SEO from '../components/common/SEO';
import BookingModal from '../components/modals/BookingModal';
import { trackConversion } from '../utils/analytics';

const TEAM_MEMBERS = [
    {
        name: 'Jean-Pierre Rousseau',
        role: 'Master Instructor & Founder',
        certifications: ['PADI Master Instructor', 'EFR Instructor Trainer', '15+ years experience'],
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        bio: 'Started diving in 2008 and has been sharing the passion for underwater exploration ever since.',
    },
    {
        name: 'Sarah Thompson',
        role: 'PADI Course Director',
        certifications: ['PADI Course Director', 'Tec Deep Instructor', '12 years experience'],
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        bio: 'Specializes in technical diving and has trained hundreds of divers to professional levels.',
    },
    {
        name: 'Raj Patel',
        role: 'Dive Instructor',
        certifications: ['PADI Staff Instructor', 'Wreck Specialty Instructor', '8 years experience'],
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        bio: 'Expert in wreck diving and underwater photography, leading exciting dive adventures.',
    },
    {
        name: 'Marie Laurent',
        role: 'Dive Instructor & Marine Biologist',
        certifications: ['PADI Instructor', 'Marine Biology Specialist', '6 years experience'],
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        bio: 'Combines passion for marine conservation with teaching, offering unique ecological insights.',
    },
];

const CREDENTIALS = [
    {
        icon: AcademicCapIcon,
        title: 'PADI 5 Star Dive Center',
        description: 'Highest rating awarded by PADI, ensuring quality training and services.',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Fully Insured',
        description: 'Comprehensive dive insurance and liability coverage for all activities.',
    },
    {
        icon: UserGroupIcon,
        title: 'Experienced Team',
        description: '50+ years combined diving experience across all instructors.',
    },
    {
        icon: TrophyIcon,
        title: 'Award Winning',
        description: 'Recognized as Mauritius\'s top-rated dive center for 3 consecutive years.',
    },
];

const AboutPage = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const handleBookingClick = () => {
        trackConversion('about_page_cta', { action: 'book_discovery_dive' });
        setIsBookingModalOpen(true);
    };

    return (
        <>
            <SEO
                title="About Us - Expert Scuba Diving Team in Mauritius"
                description="Meet our team of certified PADI instructors with 50+ years combined experience. PADI 5 Star Dive Center offering professional diving courses and guided dives in Mauritius."
            />

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920)',
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
                            About Our Dive Center
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl max-w-3xl mx-auto"
                        >
                            Passionate about diving, committed to excellence
                        </motion.p>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Our Story
                                </h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        Founded in 2010, we started with a simple mission: to share the incredible
                                        underwater world of Mauritius with divers from around the globe. What began
                                        as a small dive shop has grown into one of the island's premier PADI 5 Star
                                        Dive Centers.
                                    </p>
                                    <p>
                                        Our team of experienced instructors brings together decades of diving expertise,
                                        passion for marine conservation, and dedication to safety. We believe that
                                        diving should be accessible to everyone, which is why we offer courses for all
                                        levels—from complete beginners to professional divers.
                                    </p>
                                    <p>
                                        Located in the heart of Mauritius, we have access to some of the Indian Ocean's
                                        most spectacular dive sites. From vibrant coral reefs teeming with tropical fish
                                        to historic wrecks and dramatic underwater landscapes, every dive is an adventure.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
                                    alt="Dive center team"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className="py-16 px-4 bg-ocean-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Mission & Values
                            </h2>
                            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                                We're committed to providing safe, professional, and unforgettable diving experiences
                                while protecting the marine environment we all love.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white p-6 rounded-xl shadow-lg"
                            >
                                <div className="text-ocean-600 mb-4">
                                    <ShieldCheckIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
                                <p className="text-gray-700">
                                    Your safety is our top priority. We maintain the highest standards of equipment,
                                    training, and dive planning to ensure every dive is secure.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-lg"
                            >
                                <div className="text-ocean-600 mb-4">
                                    <AcademicCapIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Education Excellence</h3>
                                <p className="text-gray-700">
                                    We believe in quality education. Our instructors use proven teaching methods to
                                    help you become a confident, skilled diver.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg"
                            >
                                <div className="text-ocean-600 mb-4">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Marine Conservation</h3>
                                <p className="text-gray-700">
                                    We're dedicated to protecting our oceans. Through education and responsible diving
                                    practices, we work to preserve marine ecosystems.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Credentials */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Credentials
                            </h2>
                            <p className="text-lg text-gray-700">
                                Trusted, certified, and recognized for excellence
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {CREDENTIALS.map((credential, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center p-6 border border-ocean-200 rounded-xl hover:shadow-lg transition-shadow"
                                >
                                    <credential.icon className="w-16 h-16 text-ocean-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{credential.title}</h3>
                                    <p className="text-sm text-gray-600">{credential.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 px-4 bg-ocean-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Meet Our Team
                            </h2>
                            <p className="text-lg text-gray-700">
                                Experienced, passionate, and dedicated to your diving success
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {TEAM_MEMBERS.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                                >
                                    <div className="relative h-64">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                        <p className="text-ocean-600 font-semibold mb-3">{member.role}</p>
                                        <p className="text-sm text-gray-700 mb-4">{member.bio}</p>
                                        <div className="space-y-1">
                                            {member.certifications.map((cert, certIndex) => (
                                                <div
                                                    key={certIndex}
                                                    className="text-xs bg-ocean-50 text-ocean-700 px-2 py-1 rounded"
                                                >
                                                    {cert}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Equipment & Safety */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Equipment & Safety
                            </h2>
                            <p className="text-lg text-gray-700">
                                Professional-grade equipment maintained to the highest standards
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Equipment</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Latest model BCDs and regulators from Scubapro and Mares</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Dive computers for all divers (included in rental)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Aluminum and steel tanks serviced monthly</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Full range of wetsuits (3mm to 7mm) and drysuits</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Emergency oxygen and first aid equipment on every dive</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Radio communication with shore support</span>
                                    </li>
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Safety Record</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Zero major incidents in over 10 years of operation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>All instructors certified in Emergency First Response</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Comprehensive dive insurance for all participants</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Small group sizes (max 4 students per instructor)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Detailed dive briefings and site-specific safety protocols</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-ocean-600 mr-2">•</span>
                                        <span>Regular safety audits and equipment inspections</span>
                                    </li>
                                </ul>
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
                            Ready to Discover the Underwater World?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl mb-8"
                        >
                            Book your Discover Scuba Diving experience today and take your first breath underwater
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            onClick={handleBookingClick}
                            className="bg-white text-ocean-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Book Discovery Dive
                        </motion.button>
                    </div>
                </section>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                bookingType="course"
                preSelectedItem="discover-scuba"
                source="about_page"
            />
        </>
    );
};

export default AboutPage;
