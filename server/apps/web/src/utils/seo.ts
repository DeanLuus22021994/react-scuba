// SEO utilities and structured data

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface CourseData {
  name: string;
  description: string;
  price: string;
  currency: string;
}

export interface PageMetaTags {
  title: string;
  description: string;
  canonical: string;
}

export const generateLocalBusinessSchema = () => {
  const phoneNumber = import.meta.env['VITE_PHONE_NUMBER'] || '+2302634468';
  const email = import.meta.env['VITE_EMAIL'] || 'info@osdiving.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.osdiving.com',
    name: 'Ocean Spirit Scuba Diving Mauritius',
    description:
      'PADI 5 Star ECO Green Fins Scuba Diving Centre with a Green Star. Friendly, sociable dive center with comfortable club-like facilities offering professional diving courses and guided dives in Pereybere, Northern Mauritius.',
    image: 'https://www.osdiving.com/images/logo.jpg',
    url: 'https://www.osdiving.com',
    telephone: phoneNumber,
    email: email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Coastal Road',
      addressLocality: 'Pereybere',
      addressRegion: 'Rivière du Rempart',
      postalCode: '30546',
      addressCountry: 'MU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -20.01748,
      longitude: 57.57789,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '16:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '08:00',
        closes: '13:30',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'MUR, USD, EUR, GBP',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    sameAs: [
      'https://www.facebook.com/oceanspiritdiving/',
      'https://www.instagram.com/divingmauritius/',
      'https://twitter.com/OceanSpirit13',
      'https://www.youtube.com/user/oceandivermu',
      'https://www.tripadvisor.com.my/Attraction_Review-g1905319-d1717410-Reviews-Ocean_Spirit_Dive_Center-Pereybere.html',
    ],
  };
};

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateCourseSchema = (course: CourseData) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Ocean Spirit Scuba Diving Mauritius',
      sameAs: 'https://www.osdiving.com',
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency,
      availability: 'https://schema.org/InStock',
    },
  };
};

export const defaultMetaTags = {
  title: 'Ocean Spirit Scuba Diving Mauritius | PADI 5 Star ECO Centre',
  description:
    'PADI 5 Star ECO Green Fins dive center in Pereybere, Mauritius. Patient skilled PADI instructors, 65 dive sites around Northern Mauritius. Wreck diving, turtle diving, shark diving, and exquisite healthy coral reefs.',
  keywords:
    'ocean spirit, mauritius scuba diving, padi 5 star eco, padi courses mauritius, diving center pereybere, scuba lessons, dive sites mauritius, coral reef diving, coin de mire diving, green fins mauritius, eco diving',
  ogImage: 'https://www.osdiving.com/images/og-image.jpg',
  twitterCard: 'summary_large_image',
};

export const generatePageMetaTags = (page: string): PageMetaTags => {
  const baseUrl = 'https://www.osdiving.com';

  const pages: Record<string, PageMetaTags> = {
    home: {
      title: 'Ocean Spirit Scuba Diving Mauritius | PADI 5 Star ECO Centre',
      description:
        'From the day you arrive, you are among friends. PADI 5 Star ECO Green Fins dive center in Pereybere. Explore 65 dive sites around Northern Mauritius with patient skilled PADI instructors. Wreck diving, turtle diving, shark diving.',
      canonical: baseUrl,
    },
    about: {
      title: 'About Ocean Spirit | PADI 5 Star ECO Dive Centre Pereybere',
      description:
        'Ocean Spirit Scuba Diving opened March 2020 in our own building with ocean views. Comprehensive gear selection, Coffee Shop, and comfortable facilities. Promoting conservation, respect, and family values.',
      canonical: `${baseUrl}/about`,
    },
    'dive-sites': {
      title: 'Dive Sites Northern Mauritius | 65 Best Diving Locations',
      description:
        'Explore 65 great dive sites around Northern Mauritius Islands. Coin de Mire, Trou Aux Biches, wreck diving, turtle diving, shark diving, macro photography, deep diving, and exquisite healthy coral reefs.',
      canonical: `${baseUrl}/dive-sites`,
    },
    courses: {
      title: 'PADI Diving Courses | Ocean Spirit Scuba Certification Mauritius',
      description:
        'Get PADI certified with Ocean Spirit in Pereybere! Discover Scuba Diving, Open Water Diver, Advanced Open Water, Rescue Diver, and Divemaster courses with patient skilled instructors.',
      canonical: `${baseUrl}/courses`,
    },
    gallery: {
      title: 'Diving Gallery | Underwater Photos from Ocean Spirit Mauritius',
      description:
        'Browse stunning underwater photography from Ocean Spirit diving expeditions in Northern Mauritius. See the vibrant marine life, coral reefs, turtles, sharks, and unforgettable diving moments.',
      canonical: `${baseUrl}/gallery`,
    },
  };

  return pages[page] ?? pages['home']!;
};
