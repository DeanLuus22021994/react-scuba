/**
 * Dive Sites Data
 * Information about diving locations in Mauritius
 */

export const DIVE_SITES = [
  {
    id: "blue-bay",
    name: "Blue Bay Marine Park",
    coordinates: [-20.4453, 57.7089],
    depth: "5-12m",
    visibility: "Excellent (20-30m)",
    difficulty: "Beginner",
    marineLife: [
      "Parrotfish",
      "Butterflyfish",
      "Sea turtles",
      "Moray eels",
      "Coral gardens",
    ],
    description:
      "A stunning marine park with crystal-clear waters and vibrant coral reefs. Perfect for beginners and snorkelers.",
    bestSeason: "Year-round",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    highlights: [
      "Protected marine park",
      "Shallow reef perfect for training",
      "Abundant marine life",
    ],
  },
  {
    id: "cathedral",
    name: "The Cathedral",
    coordinates: [-20.2897, 57.4531],
    depth: "18-30m",
    visibility: "Very Good (15-25m)",
    difficulty: "Intermediate",
    marineLife: [
      "Lobsters",
      "Groupers",
      "Octopus",
      "Nudibranchs",
      "Reef sharks",
    ],
    description:
      "An impressive underwater cave system with cathedral-like formations. Light beams penetrate through openings creating magical effects.",
    bestSeason: "May to December",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    highlights: [
      "Dramatic cave formations",
      "Light beam displays",
      "Advanced navigation challenge",
    ],
  },
  {
    id: "coin-de-mire",
    name: "Coin de Mire",
    coordinates: [-19.8786, 57.8683],
    depth: "15-40m",
    visibility: "Excellent (25-35m)",
    difficulty: "Advanced",
    marineLife: [
      "Barracudas",
      "Tuna",
      "Dolphins",
      "Manta rays",
      "Whale sharks (seasonal)",
    ],
    description:
      "An iconic island off the north coast with dramatic walls and pelagic action. One of Mauritius's most spectacular dive sites.",
    bestSeason: "October to April",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    highlights: [
      "Big fish encounters",
      "Drift diving opportunities",
      "Dramatic underwater topography",
    ],
  },
  {
    id: "whale-rock",
    name: "Whale Rock",
    coordinates: [-20.1253, 57.7342],
    depth: "20-35m",
    visibility: "Very Good (18-28m)",
    difficulty: "Intermediate",
    marineLife: [
      "Sea turtles",
      "Eagle rays",
      "Snappers",
      "Sweetlips",
      "Nudibranchs",
    ],
    description:
      "A massive rock formation rising from the seabed, covered in hard and soft corals with plenty of swim-throughs.",
    bestSeason: "Year-round",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800",
    highlights: [
      "Unique rock formations",
      "Multiple swim-throughs",
      "Excellent for underwater photography",
    ],
  },
  {
    id: "holts-rocks",
    name: "Holt's Rocks",
    coordinates: [-20.1875, 57.6894],
    depth: "12-25m",
    visibility: "Good (15-20m)",
    difficulty: "Beginner to Intermediate",
    marineLife: [
      "Clownfish",
      "Lionfish",
      "Trumpetfish",
      "Scorpionfish",
      "Batfish",
    ],
    description:
      "A series of rocky outcrops with diverse marine life and excellent for macro photography.",
    bestSeason: "Year-round",
    image: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800",
    highlights: [
      "Macro photography paradise",
      "Diverse fish species",
      "Multiple dive levels available",
    ],
  },
];

export const MAURITIUS_CENTER = [-20.348404, 57.552152];

export const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
  "Beginner to Intermediate": "bg-green-100 text-green-800",
};

export const getDiveSiteById = (id) => {
  return DIVE_SITES.find((site) => site.id === id);
};

export const getDiveSitesByDifficulty = (difficulty) => {
  return DIVE_SITES.filter((site) =>
    site.difficulty.toLowerCase().includes(difficulty.toLowerCase())
  );
};
