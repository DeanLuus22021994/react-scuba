import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const GalleryGrid = ({ images, onImageClick }) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = entry.target.dataset.imageId;
            setLoadedImages((prev) => new Set([...prev, parseInt(imageId)]));
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const imageElements = document.querySelectorAll('.lazy-image');
    imageElements.forEach((img) => {
      if (observerRef.current) {
        observerRef.current.observe(img);
      }
    });

    return () => {
      imageElements.forEach((img) => {
        if (observerRef.current) {
          observerRef.current.unobserve(img);
        }
      });
    };
  }, [images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <div
            className="lazy-image relative aspect-square overflow-hidden bg-gray-200"
            data-image-id={image.id}
          >
            {loadedImages.has(image.id) ? (
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-300 w-full h-full" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
              <p className="text-white/90 text-sm">{image.description}</p>
              <div className="mt-2 inline-block bg-ocean-600 text-white px-2 py-1 rounded-full text-xs w-fit">
                {image.category}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

GalleryGrid.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default GalleryGrid;
