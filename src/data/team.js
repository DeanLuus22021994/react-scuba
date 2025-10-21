/**
 * Team Members Data
 * Ocean Spirit Scuba Diving Mauritius - Professional PADI Instructors
 */

export const TEAM_MEMBERS = [
  {
    name: 'Ocean Spirit Instructors',
    role: 'PADI 5 Star ECO Centre Team',
    certifications: [
      'PADI 5 Star ECO Centre',
      'Green Fins Member',
      'Reef-World Federation Partner',
    ],
    image: '/photos/hero-ocean-spirit.jpg',
    bio: 'Patient, skilled PADI instructors focused on safety. We know our fish and love our world. Committed to conservation, humility, respect, family values and career development.',
  },
  {
    name: 'Ocean Spirit Team',
    role: 'Dive Professionals',
    certifications: ['PADI Instructors', 'EFR Certified', 'Green Fins Trained'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Friendly and sociable team providing a comfortable, club-like diving experience in Northern Mauritius with 65 great dive sites.',
  },
  {
    name: 'Raj Patel',
    role: 'Dive Instructor',
    certifications: ['PADI Staff Instructor', 'Wreck Specialty Instructor', '8 years experience'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in wreck diving and underwater photography, leading exciting dive adventures.',
  },
  {
    name: 'Marie Laurent',
    role: 'Dive Instructor & Marine Biologist',
    certifications: ['PADI Instructor', 'Marine Biology Specialist', '6 years experience'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Combines passion for marine conservation with teaching, offering unique ecological insights.',
  },
];

export const getTeamMemberByName = (name) => {
  return TEAM_MEMBERS.find((member) => member.name === name);
};
