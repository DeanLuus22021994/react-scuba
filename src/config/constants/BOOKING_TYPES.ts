/**
 * Booking Types Data
 * Course and dive booking options
 */

export const EXPERIENCE_LEVELS = [
  'Beginner - Never dived before',
  'Discover Scuba Diver',
  'Open Water Diver',
  'Advanced Open Water Diver',
  'Rescue Diver',
  'Divemaster or higher',
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export interface BookingItem {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface BookingTypes {
  course: BookingItem[];
  dive: BookingItem[];
}

export const BOOKING_TYPES: BookingTypes = {
  course: [
    {
      id: 'discover-scuba',
      name: 'Discover Scuba Diving',
      duration: '1 day',
      price: 4500,
    },
    {
      id: 'open-water',
      name: 'Open Water Diver',
      duration: '3-4 days',
      price: 15000,
    },
    {
      id: 'advanced',
      name: 'Advanced Open Water',
      duration: '2-3 days',
      price: 12000,
    },
    { id: 'rescue', name: 'Rescue Diver', duration: '3-4 days', price: 14000 },
    {
      id: 'divemaster',
      name: 'Divemaster Course',
      duration: '6-8 weeks',
      price: 45000,
    },
  ],
  dive: [
    {
      id: 'single-dive',
      name: 'Single Dive',
      duration: '2-3 hours',
      price: 2500,
    },
    {
      id: 'double-dive',
      name: 'Double Dive',
      duration: '4-5 hours',
      price: 4000,
    },
    {
      id: 'night-dive',
      name: 'Night Dive',
      duration: '2-3 hours',
      price: 3500,
    },
    {
      id: 'wreck-dive',
      name: 'Wreck Dive',
      duration: '3-4 hours',
      price: 3000,
    },
  ],
} as const;

export const getBookingItemById = (type: keyof BookingTypes, id: string): BookingItem | undefined => {
  const items = BOOKING_TYPES[type] || [];
  return items.find((item) => item.id === id);
};

export const getBookingItems = (type: keyof BookingTypes): BookingItem[] => {
  return BOOKING_TYPES[type] || BOOKING_TYPES.dive;
};
