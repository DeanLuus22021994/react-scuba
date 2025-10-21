/**
 * Team Members Data
 * Information about dive center instructors and staff
 */

export const TEAM_MEMBERS = [
  {
    name: "Jean-Pierre Rousseau",
    role: "Master Instructor & Founder",
    certifications: [
      "PADI Master Instructor",
      "EFR Instructor Trainer",
      "15+ years experience",
    ],
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
    bio: "Started diving in 2008 and has been sharing the passion for underwater exploration ever since.",
  },
  {
    name: "Sarah Thompson",
    role: "PADI Course Director",
    certifications: [
      "PADI Course Director",
      "Tec Deep Instructor",
      "12 years experience",
    ],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    bio: "Specializes in technical diving and has trained hundreds of divers to professional levels.",
  },
  {
    name: "Raj Patel",
    role: "Dive Instructor",
    certifications: [
      "PADI Staff Instructor",
      "Wreck Specialty Instructor",
      "8 years experience",
    ],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Expert in wreck diving and underwater photography, leading exciting dive adventures.",
  },
  {
    name: "Marie Laurent",
    role: "Dive Instructor & Marine Biologist",
    certifications: [
      "PADI Instructor",
      "Marine Biology Specialist",
      "6 years experience",
    ],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "Combines passion for marine conservation with teaching, offering unique ecological insights.",
  },
];

export const getTeamMemberByName = (name) => {
  return TEAM_MEMBERS.find((member) => member.name === name);
};
