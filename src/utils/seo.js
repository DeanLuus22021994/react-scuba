// SEO utilities and structured data

export const generateLocalBusinessSchema = () => {
  const phoneNumber = import.meta.env.VITE_PHONE_NUMBER || "+230XXXXXXXX";
  const email = import.meta.env.VITE_EMAIL || "info@mauritiusscuba.com";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.mauritiusscuba.com",
    name: "Mauritius Scuba Diving Center",
    description:
      "Professional scuba diving center in Mauritius offering PADI courses, guided dives, and unforgettable underwater experiences in the crystal-clear waters of the Indian Ocean.",
    image: "https://www.mauritiusscuba.com/images/logo.jpg",
    url: "https://www.mauritiusscuba.com",
    telephone: phoneNumber,
    email: email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Coastal Road",
      addressLocality: "Grand Baie",
      addressRegion: "Rivière du Rempart",
      postalCode: "30501",
      addressCountry: "MU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -20.348404,
      longitude: 57.552152,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "MUR, USD, EUR, GBP",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    sameAs: [
      "https://www.facebook.com/mauritiusscuba",
      "https://www.instagram.com/mauritiusscuba",
      "https://www.twitter.com/mauritiusscuba",
    ],
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateCourseSchema = (course) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Mauritius Scuba Diving Center",
      sameAs: "https://www.mauritiusscuba.com",
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
    },
  };
};

export const defaultMetaTags = {
  title:
    "Mauritius Scuba Diving Center | PADI Certified Diving Courses & Tours",
  description:
    "Discover the underwater paradise of Mauritius with our PADI certified scuba diving courses and guided tours. Experience crystal-clear waters, vibrant coral reefs, and diverse marine life.",
  keywords:
    "mauritius scuba diving, padi courses mauritius, diving center mauritius, scuba lessons, underwater tours, coral reef diving, blue bay diving, grand baie scuba",
  ogImage: "https://www.mauritiusscuba.com/images/og-image.jpg",
  twitterCard: "summary_large_image",
};

export const generatePageMetaTags = (page) => {
  const baseUrl = "https://www.mauritiusscuba.com";

  const pages = {
    home: {
      title:
        "Mauritius Scuba Diving Center | PADI Certified Diving Courses & Tours",
      description:
        "Discover the underwater paradise of Mauritius with our PADI certified scuba diving courses and guided tours. Experience crystal-clear waters, vibrant coral reefs, and diverse marine life.",
      canonical: baseUrl,
    },
    about: {
      title: "About Us | Mauritius Scuba Diving Center",
      description:
        "Learn about our experienced team, PADI certifications, and commitment to safe, memorable scuba diving experiences in Mauritius. Over 10 years of excellence in diving education.",
      canonical: `${baseUrl}/about`,
    },
    "dive-sites": {
      title: "Dive Sites in Mauritius | Best Diving Locations",
      description:
        "Explore the best diving sites in Mauritius including Blue Bay, Cathedral, Coin de Mire, and more. Detailed information about depth, visibility, and marine life at each location.",
      canonical: `${baseUrl}/dive-sites`,
    },
    courses: {
      title: "PADI Diving Courses | Scuba Certification in Mauritius",
      description:
        "Get PADI certified in Mauritius! We offer Discover Scuba Diving, Open Water Diver, Advanced Open Water, Rescue Diver, and Divemaster courses with experienced instructors.",
      canonical: `${baseUrl}/courses`,
    },
    gallery: {
      title: "Diving Gallery | Underwater Photos from Mauritius",
      description:
        "Browse stunning underwater photography from our diving expeditions in Mauritius. See the vibrant marine life, coral reefs, and unforgettable diving moments.",
      canonical: `${baseUrl}/gallery`,
    },
  };

  return pages[page] || pages.home;
};
