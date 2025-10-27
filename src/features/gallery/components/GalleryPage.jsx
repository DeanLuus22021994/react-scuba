import { CATEGORIES, getImagesByCategory } from '@config/constants/GALLERY';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { trackConversion } from '../../utils/analytics';
import SEO from '../common/SEO';
import BookingModal from '../modals/BookingModal';
import FeaturedCarousel from './FeaturedCarousel';
import GalleryGrid from './GalleryGrid';
import Lightbox from './Lightbox';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredImages = getImagesByCategory(selectedCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    trackConversion('gallery_image_view', {
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
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredImages.length
        : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleBookPhotoDive = () => {
    trackConversion('gallery_page_cta', { action: 'book_photo_dive' });
    setIsBookingModalOpen(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    trackConversion('gallery_category_filter', { category });
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

        {/* Featured Carousel */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <FeaturedCarousel />
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Gallery</h2>
              <p className="text-lg text-gray-700 mb-8">Browse through our collection of underwater moments</p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-ocean-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-ocean-50 hover:text-ocean-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <GalleryGrid images={filteredImages} onImageClick={openLightbox} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-6">Want to Capture Your Own Underwater Memories?</h2>
              <p className="text-lg text-gray-700 mb-8">
                Join us for a photo dive and create your own stunning underwater images. We provide guidance on underwater photography
                techniques and help you capture the magic of Mauritius&apos;s reefs.
              </p>
              <button
                onClick={handleBookPhotoDive}
                className="bg-ocean-600 hover:bg-ocean-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Book a Photo Dive
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <Lightbox image={selectedImage} isOpen={lightboxOpen} onClose={closeLightbox} onNavigate={navigateImage} />

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} bookingType="dive" source="gallery_page" />
    </>
  );
};

export default GalleryPage;
