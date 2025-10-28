/**
 * Team Members Data
 * Ocean Spirit Scuba Diving Mauritius - Professional PADI Instructors
 * Real team members from Ocean Spirit Dive Center
 */

export interface TeamMember {
  name: string;
  role: string;
  certifications: string[];
  image: string;
  bio: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Jill Holloway',
    role: 'Director & PADI Diver',
    certifications: [
      'Director',
      'DEPTH Magazine Editor',
      'Divestyle Editor',
      'Videographer',
    ],
    image: '/images/team/jill-holloway.jpg',
    bio: 'Leading Ocean Spirit with passion for marine conservation and diving education. Editor of Diving Journaluis and DEPTH Magazine, bringing extensive media expertise to showcase Mauritius\'s underwater beauty.',
  },
  {
    name: 'Bobby',
    role: 'PADI IDC Staff Instructor',
    certifications: [
      'PADI IDC Staff Instructor',
      'Enriched Air Instructor',
      'EFR Instructor',
      'Master Diver Trainer',
      '8 Specialities Trainer',
    ],
    image: '/images/team/bobby-instructor.jpg',
    bio: 'Patient and kind instructor with comprehensive expertise across multiple diving specialties. Dedicated to developing safe, confident divers through personalized instruction and unwavering commitment to safety standards.',
  },
  {
    name: 'Roger Grenouillet',
    role: 'PADI MSDT Instructor',
    certifications: [
      'PADI MSDT Instructor',
      '12+ PADI Specialities',
      'CMAS ** Instructor',
      'SSI Dive Specialist',
    ],
    image: '/images/team/roger-grenouillet.jpg',
    bio: 'The pater familias of Ocean Spirit with decades of experience and mastery across multiple diving organizations. Versatile expertise spanning PADI, CMAS, and SSI certifications ensures world-class instruction.',
  },
  {
    name: 'Bernard',
    role: 'PADI Teaching Superb Divemaster & Skipper',
    certifications: [
      'PADI Divemaster #432774',
      'PADI EFR',
      'Licensed Skipper',
      'Boat Operations Expert',
    ],
    image: '/images/team/bernard-skipper.jpg',
    bio: 'Expert divemaster and skipper ensuring safe, enjoyable journeys to Mauritius\'s best dive sites. Combines professional dive leadership with masterful boat handling for seamless underwater adventures.',
  },
  {
    name: 'Yogesh',
    role: 'PADI Instructor',
    certifications: [
      'PADI Instructor',
      'PADI EFR Instructor',
      'Emergency Response Specialist',
    ],
    image: '/images/team/yogesh-instructor.jpg',
    bio: 'Dedicated instructor focused on building diver confidence through comprehensive training and emergency response preparation. Committed to creating safe, memorable diving experiences.',
  },
  {
    name: 'Nando Nagain',
    role: 'PADI Instructor & Technical Officer',
    certifications: [
      'PADI Instructor',
      'Rec Tec Gas Blender',
      'Technical Officer',
      'PADI EFR',
      'Videographer',
    ],
    image: '/images/team/nando-nagain.jpg',
    bio: 'Technical diving specialist and gas blending expert. Captures stunning underwater footage while leading advanced dives. Ensures all technical equipment meets the highest safety standards.',
  },
  {
    name: 'Jovani',
    role: 'Professional Skipper',
    certifications: [
      'Licensed Skipper',
      'Multilingual',
      'Navigation Expert',
      'Marine Safety Specialist',
    ],
    image: '/images/team/jovani-skipper.jpg',
    bio: 'Incredibly experienced skipper with multilingual capabilities and deep knowledge of Mauritius waters. Sociable and safety-focused, ensuring comfortable journeys to all 65 dive sites in Northern Mauritius.',
  },
  {
    name: 'Ian Haggerty',
    role: 'Conservationist & Social Media',
    certifications: [
      'PADI Rescue Diver',
      'CMAS Level 3',
      'Conservation Specialist',
      'Marketing & Outreach',
    ],
    image: '/images/team/ian-haggerty.jpg',
    bio: 'Passionate conservationist driving Ocean Spirit\'s environmental programs and community outreach. Manages social media presence to share Mauritius\'s marine wonders while promoting sustainable diving practices.',
  },
] as const;

export const getTeamMemberByName = (name: string): TeamMember | undefined => {
  return TEAM_MEMBERS.find((member) => member.name === name);
};
