import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SEO from '../components/common/SEO';
import BookingModal from '../components/modals/BookingModal';
import { trackEvent } from '../utils/analytics';

const CATEGORIES = ['All', 'Underwater', 'Marine Life', 'Divers', 'Boats', 'Reefs'];

const GALLERY_IMAGES = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        category: 'Underwater',
        title: 'Crystal Clear Waters',
        description: 'Exploring the pristine waters of Blue Bay Marine Park',
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        category: 'Divers',
        title: 'Deep Sea Exploration',
        description: 'Advanced divers exploring the depths of Coin de Mire',
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
        category: 'Marine Life',
        title: 'Sea Turtle Encounter',
        description: 'Swimming alongside a magnificent green sea turtle',
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
        category: 'Reefs',
        title: 'Coral Garden Paradise',
        description: 'Vibrant coral formations teeming with life',
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400',
        category: 'Marine Life',
        title: 'School of Fish',
        description: 'Massive school of tropical fish in formation',
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
        category: 'Underwater',
        title: 'Blue Depths',
        description: 'The mesmerizing blue abyss of the Indian Ocean',
    },
    {
        id: 7,
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
        category: 'Divers',
        title: 'Cave Diving',
        description: 'Exploring underwater caves and formations',
    },
    {
        id: 8,
        url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
        category: 'Boats',
        title: 'Dive Boat Ready',
        description: 'Our modern dive boat equipped for adventure',
    },
    {
        id: 9,
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&sat=-100',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&sat=-100',
        category: 'Underwater',
        title: 'Wreck Diving',
        description: 'Historic shipwreck covered in marine growth',
    },
    {
        id: 10,
        url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
        category: 'Marine Life',
        title: 'Majestic Ray',
        description: 'Eagle ray gliding gracefully through the water',
    },
    {
        id: 11,
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80',
        category: 'Reefs',
        title: 'Colorful Reef Life',
        description: 'The vibrant colors of a healthy coral reef ecosystem',
    },
    {
        id: 12,
        url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&q=80',
        category: 'Marine Life',
        title: 'Curious Octopus',
        description: 'An intelligent octopus investigating the diver',
    },
];

const GalleryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [visibleImages, setVisibleImages] = useState([]);
    const observerRef = useRef(null);

    const filteredImages = selectedCategory === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

    // Lazy loading with Intersection Observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.01,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const imgId = parseInt(entry.target.dataset.imgId);
                    setVisibleImages((prev) => [...new Set([...prev, imgId])]);
                }
            });
        }, options);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const openLightbox = (image) => {
        setSelectedImage(image);
        setLightboxOpen(true);
        trackEvent('gallery_image_view', {
            image_id: image.id,
            image_title: image.title,
            category: image.category,
        });
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setTimeout(() => setSelectedImage(null), 300);
    };

    const navigateImage = (direction) => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % filteredImages.length
            : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage(filteredImages[newIndex]);
    };

    const handleBookPhotoDive = () => {
        trackEvent('gallery_page_cta', { action: 'book_photo_dive' });
        setIsBookingModalOpen(true);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        trackEvent('gallery_category_filter', { category });
    };

    return (
        <>
            <SEO
                title="Dive Gallery - Underwater Photography from Mauritius"
                description="Explore stunning underwater photography from our dives in Mauritius. Marine life, coral reefs, dive boats, and divers in action. Book your photo dive today."
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
                            Dive Gallery
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl max-w-3xl mx-auto"
                        >
                            Capturing the beauty beneath the waves
                        </motion.p>
                    </div>
                </section>

                {/* Featured Gallery Swiper */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Featured Highlights
                            </h2>
                            <p className="text-lg text-gray-700">
                                Our best shots from recent dives
                            </p>
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            loop
                            className="rounded-xl shadow-2xl overflow-hidden"
                            style={{ maxHeight: '500px' }}
                        >
                            {GALLERY_IMAGES.slice(0, 6).map((image) => (
                                <SwiperSlide key={image.id}>
                                    <div className="relative h-[500px]">
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-8 left-8 text-white">
                                            <h3 className="text-3xl font-bold mb-2">{image.title}</h3>
                                            <p className="text-lg">{image.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>

                {/* Category Filter */}
                <section className="py-8 px-4 bg-ocean-50 border-b">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-4 justify-center items-center">
                            <span className="font-semibold text-gray-700">Categories:</span>
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedCategory === category
                                            ? 'bg-ocean-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    data-img-id={image.id}
                                    ref={(el) => {
                                        if (el && observerRef.current) {
                                            observerRef.current.observe(el);
                                        }
                                    }}
                                    onClick={() => openLightbox(image)}
                                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                                >
                                    {visibleImages.includes(image.id) ? (
                                        <>
                                            <img
                                                src={image.thumbnail}
                                                alt={image.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h3 className="font-bold text-lg">{image.title}</h3>
                                                    <p className="text-sm">{image.category}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {filteredImages.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">No images found in this category.</p>
                            </div>
                        )}
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
                            Want to Capture Your Own Moments?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl mb-8"
                        >
                            Book a photo dive with our underwater photography guide
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            onClick={handleBookPhotoDive}
                            className="bg-white text-ocean-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Book Photo Dive
                        </motion.button>
                    </div>
                </section>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                            aria-label="Close"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage('prev');
                            }}
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                            aria-label="Previous"
                        >
                            <ChevronLeftIcon className="w-12 h-12" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateImage('next');
                            }}
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                            aria-label="Next"
                        >
                            <ChevronRightIcon className="w-12 h-12" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-6xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="mt-4 text-white text-center">
                                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                                <p className="text-gray-300">{selectedImage.description}</p>
                                <p className="text-sm text-gray-400 mt-2">{selectedImage.category}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                bookingType="dive"
                source="gallery_page"
            />
        </>
    );
};

export default GalleryPage;
