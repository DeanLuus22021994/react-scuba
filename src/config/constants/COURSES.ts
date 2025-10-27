/**
 * PADI Course Data
 * Centralized course information for the dive center
 */

export interface Course {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  minAge: number;
  prerequisites: string;
  maxDepth: string;
  certification: string;
  image: string;
  description: string;
  included: string[];
  curriculum: string[];
  specialOffer?: string;
}

export interface DivePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  included: string[];
  highlights: string[];
}

export const COURSES: Course[] = [
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
    description:
      "Your first adventure underwater! Step one of your PADI Open Water Certification. Experience the thrill of scuba diving with Ocean Spirit's patient, skilled instructors.",
    included: [
      'Theory session and safety briefing',
      'Confined water practice session',
      'Open water dive (up to 12m)',
      'All equipment rental with personal mouthpieces',
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
    specialOffer: 'Couples DSD Special - Contact us for pricing',
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
    description: "The world's most popular scuba certification. Learn to dive independently with a buddy to a maximum depth of 18 meters.",
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
    description:
      'Build confidence and expand your diving skills with underwater navigation, deep diving, and three specialty dives of your choice.',
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
    tagline: 'Learn to prevent and manage diving emergencies',
    price: 14000,
    duration: '3-4 days',
    minAge: 12,
    prerequisites: 'Advanced Open Water Diver + EFR certification',
    maxDepth: '30m',
    certification: 'PADI Rescue Diver',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    description:
      'Challenge yourself while learning to prevent and manage dive emergencies. This course builds confidence and prepares you for leadership roles.',
    included: [
      'PADI eLearning or classroom sessions',
      'Rescue skills practice scenarios',
      '2 open water rescue scenarios',
      'Emergency First Response (EFR) course',
      'All equipment rental during course',
      'PADI certification and card',
    ],
    curriculum: [
      'Self-rescue techniques',
      'Recognizing and managing stress in divers',
      'Emergency management and equipment',
      'Rescue diver scenarios',
      'Accident management procedures',
    ],
  },
  {
    id: 'divemaster',
    name: 'Divemaster Course',
    tagline: 'Become a diving professional',
    price: 45000,
    duration: '6-8 weeks',
    minAge: 18,
    prerequisites: 'Rescue Diver + 40 logged dives + EFR',
    maxDepth: '40m',
    certification: 'PADI Divemaster',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
    description:
      'Your first step into the professional diving world. Learn to supervise diving activities and assist instructors with student divers.',
    included: [
      'Comprehensive PADI eLearning',
      'Dive theory and physics workshops',
      'Skills assessment and development',
      'Practical teaching experience',
      'Dive planning and management training',
      'PADI professional certification',
      'Insurance and registration for first year',
    ],
    curriculum: [
      'Physics and physiology of diving',
      'Dive equipment specialist knowledge',
      'Supervising certified divers',
      'Assisting with training dives',
      'Conducting PADI programs',
      'Dive site management',
      'Emergency assistance planning',
    ],
  },
] as const;

export const COURSE_COMPARISON_HEADERS = ['Course', 'Duration', 'Min Age', 'Prerequisites', 'Max Depth', 'Price'] as const;

export const getCourseById = (id: string): Course | undefined => {
  return COURSES.find((course) => course.id === id);
};

export const getCoursesByLevel = (level: 'beginner' | 'intermediate' | 'professional'): Course[] => {
  const levels = {
    beginner: ['discover-scuba', 'open-water'],
    intermediate: ['advanced', 'rescue'],
    professional: ['divemaster'],
  };

  const courseIds = levels[level] || [];
  return COURSES.filter((course) => courseIds.includes(course.id));
};

export const DIVE_PACKAGES: DivePackage[] = [
  {
    id: 'best-of-north-10',
    name: 'Best of the North - 10 Dive Package',
    price: 20000,
    description: '10 dive package including a 2 dive Safari to Coin de Mire island and Trou Aux Biches',
    included: [
      '10 dives total',
      '2 dive Safari to Coin de Mire island',
      'Trou Aux Biches diving',
      'All equipment rental',
      'Personal mouthpieces',
      'Gear reserved for exclusive use',
    ],
    highlights: ['Wreck diving', 'Turtle diving', 'Shark diving', 'Healthy coral reefs'],
  },
] as const;
