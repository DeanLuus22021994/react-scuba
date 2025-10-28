import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  sizes = '100vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const getWebPSrc = (imageSrc) => {
    const ext = imageSrc.split('.').pop();
    return imageSrc.replace(new RegExp(`\\.${ext}$`), '.webp');
  };

  const generateSrcSet = (imageSrc) => {
    const baseUrl = imageSrc.replace(/\.[^/.]+$/, '');
    const ext = imageSrc.split('.').pop();
    return `${baseUrl}-320.${ext} 320w, ${baseUrl}-640.${ext} 640w, ${baseUrl}-1024.${ext} 1024w, ${imageSrc} 1920w`;
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width || '100%', height: height || '100%' }}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-ocean-100 to-ocean-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      {isInView && (
        <picture>
          <source
            type="image/webp"
            srcSet={generateSrcSet(getWebPSrc(src))}
            sizes={sizes}
          />
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-${objectFit} transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  priority: PropTypes.bool,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  sizes: PropTypes.string,
};

export default OptimizedImage;
