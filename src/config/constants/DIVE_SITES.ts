/**
 * Dive Sites Data
 * Information about diving locations in Mauritius
 */

export type Coordinates = [number, number]; // [latitude, longitude]

export interface DiveSite {
  id: string;
  name: string;
  coordinates: Coordinates;
  depth: string;
  visibility: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Intermediate';
  marineLife: string[];
  description: string;
  bestSeason: string;
  image: string;
  highlights: string[];
}

export const DIVE_SITES: DiveSite[] = [
  {
    id: 'coin-de-mire',
    name: 'Coin de Mire Island',
    coordinates: [-19.8786, 57.8683],
    depth: '15-40m',
    visibility: 'Excellent (25-35m)',
    difficulty: 'Advanced',
    marineLife: [
      'Barracudas',
      'Tuna',
      'Dolphins',
      'Manta rays',
      'Whale sharks (seasonal)',
      'Sharks',
      'Pelagic fish',
    ],
    description:
      "An iconic island off the north coast with dramatic walls and pelagic action. Part of Ocean Spirit's Best of the North 10 dive package. One of Mauritius's most spectacular dive sites featuring dramatic underwater topography and big fish encounters.",
    bestSeason: 'October to April',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    highlights: [
      '2 dive Safari destination',
      'Big fish encounters',
      'Drift diving opportunities',
      'Dramatic underwater topography',
      'Excellent visibility',
    ],
  },
  {
    id: 'trou-aux-biches',
    name: 'Trou Aux Biches',
    coordinates: [-20.0389, 57.5467],
    depth: '10-25m',
    visibility: 'Very Good (18-25m)',
    difficulty: 'Beginner to Intermediate',
    marineLife: [
      'Sea turtles',
      'Parrotfish',
      'Butterflyfish',
      'Moray eels',
      'Coral gardens',
      'Reef fish',
      'Clownfish',
    ],
    description:
      'Beautiful dive site in Northern Mauritius with healthy coral reefs. Part of the Best of the North package. Popular for turtle encounters and perfect for all skill levels with warm water and excellent visibility.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    highlights: [
      'Turtle diving',
      'Shallow coral reef',
      'Part of Best of North package',
      'Great for all levels',
      'Healthy coral gardens',
    ],
  },
  {
    id: 'djabeda-wreck',
    name: 'Djabeda Ship Wreck',
    coordinates: [-20.0125, 57.5789],
    depth: '18-30m',
    visibility: 'Good (15-20m)',
    difficulty: 'Intermediate',
    marineLife: ['Lionfish', 'Groupers', 'Moray eels', 'Snappers', 'Octopus'],
    description:
      'Historic shipwreck offering exciting wreck diving exploration. Great for underwater photography and marine life encounters.',
    bestSeason: 'May to December',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    highlights: [
      'Wreck diving specialty',
      'Historic vessel',
      'Abundant marine life',
      'Photography opportunities',
    ],
  },
  {
    id: 'whale-rock',
    name: 'Whale Rock',
    coordinates: [-20.1253, 57.7342],
    depth: '20-35m',
    visibility: 'Very Good (18-28m)',
    difficulty: 'Intermediate',
    marineLife: ['Sea turtles', 'Eagle rays', 'Snappers', 'Sweetlips', 'Nudibranchs'],
    description:
      'A massive rock formation rising from the seabed, covered in hard and soft corals with plenty of swim-throughs.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    highlights: [
      'Unique rock formations',
      'Multiple swim-throughs',
      'Excellent for underwater photography',
    ],
  },
  {
    id: 'holts-rocks',
    name: "Holt's Rocks",
    coordinates: [-20.1875, 57.6894],
    depth: '12-25m',
    visibility: 'Good (15-20m)',
    difficulty: 'Beginner to Intermediate',
    marineLife: ['Clownfish', 'Lionfish', 'Trumpetfish', 'Scorpionfish', 'Batfish'],
    description:
      'A series of rocky outcrops with diverse marine life and excellent for macro photography.',
    bestSeason: 'Year-round',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800',
    highlights: [
      'Macro photography paradise',
      'Diverse fish species',
      'Multiple dive levels available',
    ],
  },
] as const;

export const MAURITIUS_CENTER: Coordinates = [-20.01748, 57.57789]; // Pereybere, Ocean Spirit location

export const DIFFICULTY_COLORS: Record<DiveSite['difficulty'], string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
  'Beginner to Intermediate': 'bg-green-100 text-green-800',
} as const;

export const getDiveSiteById = (id: string): DiveSite | undefined => {
  return DIVE_SITES.find((site) => site.id === id);
};

export const getDiveSitesByDifficulty = (difficulty: string): DiveSite[] => {
  return DIVE_SITES.filter((site) =>
    site.difficulty.toLowerCase().includes(difficulty.toLowerCase())
  );
};
