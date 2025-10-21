# Gallery Data

The gallery data structure contains images for the Ocean Spirit Scuba website, including underwater photography, marine life, divers, boats, and reef scenes with categorization and filtering capabilities.

## Image Structure

Each gallery image object contains the following properties:

```javascript
{
  id: 1,                                    // Unique numeric identifier
  url: 'https://images.unsplash.com/...',   // Full resolution image URL
  thumbnail: 'https://images.unsplash.com/...', // Thumbnail image URL
  category: 'Underwater',                   // Image category
  title: 'Crystal Clear Waters',            // Image title
  description: 'Exploring the pristine...' // Image description
}
```

## Gallery Categories

### Available Categories

```javascript
import { CATEGORIES } from '@/data/gallery';

console.log(CATEGORIES);
// ['All', 'Underwater', 'Marine Life', 'Divers', 'Boats', 'Reefs']
```

**Category Descriptions:**

- **All:** All gallery images
- **Underwater:** General underwater scenes and environments
- **Marine Life:** Fish, turtles, rays, and other sea creatures
- **Divers:** Images featuring scuba divers
- **Boats:** Dive boats and surface vessels
- **Reefs:** Coral reefs and reef ecosystems

## Gallery Images

### GALLERY_IMAGES Array

```javascript
import { GALLERY_IMAGES } from '@/data/gallery';

// Access all gallery images
console.log(GALLERY_IMAGES.length); // 12 images
```

### Featured Images

```javascript
import { FEATURED_IMAGES } from '@/data/gallery';

// First 6 images for homepage/featured sections
console.log(FEATURED_IMAGES.length); // 6 images
```

## Helper Functions

### Get Images by Category

```javascript
import { getImagesByCategory } from '@/data/gallery';

// Get all underwater images
const underwaterImages = getImagesByCategory('Underwater');

// Get all marine life images
const marineLifeImages = getImagesByCategory('Marine Life');

// Get all images (same as GALLERY_IMAGES)
const allImages = getImagesByCategory('All');
```

**Parameters:**

- `category` (string): Category name ('All', 'Underwater', 'Marine Life', 'Divers', 'Boats', 'Reefs')

**Returns:** Array of image objects

### Get Image by ID

```javascript
import { getImageById } from '@/data/gallery';

// Get specific image details
const image = getImageById(1);
console.log(image.title); // "Crystal Clear Waters"
console.log(image.url); // Full resolution URL
console.log(image.thumbnail); // Thumbnail URL
```

**Parameters:**

- `id` (number): Image ID

**Returns:** Image object or `undefined` if not found

## Usage in Components

### Gallery Grid Component

```javascript
import { GALLERY_IMAGES, CATEGORIES, getImagesByCategory } from '@/data/gallery';

function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredImages = getImagesByCategory(selectedCategory);

  return (
    <div className="gallery-container">
      {/* Category Filter */}
      <div className="category-filter">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="image-grid">
        {filteredImages.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.thumbnail} alt={image.title} onClick={() => openLightbox(image)} />
            <div className="image-overlay">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Featured Gallery Component

```javascript
import { FEATURED_IMAGES } from '@/data/gallery';

function FeaturedGallery() {
  return (
    <section className="featured-gallery">
      <h2>Featured Images</h2>
      <div className="featured-grid">
        {FEATURED_IMAGES.map((image) => (
          <div key={image.id} className="featured-image">
            <img src={image.thumbnail} alt={image.title} />
            <div className="image-info">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
              <span className="category">{image.category}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Lightbox/Modal Component

```javascript
import { getImageById, GALLERY_IMAGES } from '@/data/gallery';

function ImageLightbox({ imageId, onClose }) {
  const image = getImageById(imageId);
  const currentIndex = GALLERY_IMAGES.findIndex((img) => img.id === imageId);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    const nextId = GALLERY_IMAGES[nextIndex].id;
    // Navigate to next image
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? GALLERY_IMAGES.length - 1 : currentIndex - 1;
    const prevId = GALLERY_IMAGES[prevIndex].id;
    // Navigate to previous image
  };

  if (!image) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={image.url} alt={image.title} />
        <div className="lightbox-info">
          <h3>{image.title}</h3>
          <p>{image.description}</p>
          <span className="category">{image.category}</span>
        </div>
        <button onClick={prevImage}>Previous</button>
        <button onClick={nextImage}>Next</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

## Image Optimization

### Responsive Images

```javascript
function OptimizedImage({ image }) {
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={image.thumbnail} />
      <img src={image.url} alt={image.title} loading="lazy" decoding="async" />
    </picture>
  );
}
```

### Lazy Loading

```javascript
import { useState, useRef, useEffect } from 'react';

function LazyImage({ src, alt, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.1,
    });

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="lazy-image-container">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={isLoaded ? 'loaded' : 'loading'}
          {...props}
        />
      )}
      {!isLoaded && <div className="image-placeholder" />}
    </div>
  );
}
```

## Category Statistics

```javascript
import { GALLERY_IMAGES, CATEGORIES } from '@/data/gallery';

function GalleryStats() {
  const stats = CATEGORIES.reduce((acc, category) => {
    if (category === 'All') {
      acc[category] = GALLERY_IMAGES.length;
    } else {
      acc[category] = GALLERY_IMAGES.filter((img) => img.category === category).length;
    }
    return acc;
  }, {});

  return (
    <div className="gallery-stats">
      {Object.entries(stats).map(([category, count]) => (
        <div key={category} className="stat-item">
          <span className="category">{category}</span>
          <span className="count">{count} images</span>
        </div>
      ))}
    </div>
  );
}
```

## Image Metadata

All images include Unsplash URLs with optimization parameters:

- **Full Resolution:** `w=1200` for high-quality display
- **Thumbnails:** `w=400` for grid views and previews
- **Quality:** `q=80` for optimal compression
- **Effects:** Saturation and hue adjustments for variety

## Performance Considerations

- Use thumbnails for grid views to reduce bandwidth
- Implement lazy loading for better performance
- Consider using WebP format for modern browsers
- Preload critical images (featured images)

## Accessibility

- Always include descriptive alt text
- Ensure sufficient color contrast for overlays
- Support keyboard navigation in lightboxes
- Provide image descriptions for screen readers
