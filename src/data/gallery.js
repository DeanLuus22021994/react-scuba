/**
 * Gallery Images Data
 * Underwater photography and dive center images
 */

export const CATEGORIES = ['All', 'Underwater', 'Marine Life', 'Divers', 'Boats', 'Reefs'];

export const GALLERY_IMAGES = [
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
    description: 'Vibrant reef ecosystem with tropical fish',
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&hue=120',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&hue=120',
    category: 'Underwater',
    title: 'Deep Blue Adventure',
    description: 'Descending into the mysterious deep',
  },
];

export const FEATURED_IMAGES = GALLERY_IMAGES.slice(0, 6);

export const getImagesByCategory = (category) => {
  if (category === 'All') return GALLERY_IMAGES;
  return GALLERY_IMAGES.filter((image) => image.category === category);
};

export const getImageById = (id) => {
  return GALLERY_IMAGES.find((image) => image.id === id);
};
