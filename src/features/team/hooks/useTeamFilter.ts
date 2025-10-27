import { TEAM_MEMBERS, type TeamMember } from '@config/constants/TEAM';
import { useMemo, useState } from 'react';

export type InstructorSpecialty = 'beginner' | 'advanced' | 'technical' | 'photography' | 'all';

export interface UseTeamFilterOptions {
  initialSpecialty?: InstructorSpecialty;
}

export interface UseTeamFilterReturn {
  members: TeamMember[];
  specialty: InstructorSpecialty;
  setSpecialty: (specialty: InstructorSpecialty) => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

/**
 * useTeamFilter Hook
 *
 * Custom hook for filtering team members by specialty.
 * Useful for displaying specific instructor types.
 */
export const useTeamFilter = (options?: UseTeamFilterOptions): UseTeamFilterReturn => {
  const [specialty, setSpecialty] = useState<InstructorSpecialty>(options?.initialSpecialty || 'all');

  const members = useMemo(() => {
    if (specialty === 'all') {
      return TEAM_MEMBERS;
    }

    // TODO: Add specialty property to TeamMember interface
    // For now, filter by role keywords
    return TEAM_MEMBERS.filter((member) => {
      const roleLower = member.role.toLowerCase();

      if (specialty === 'beginner' && roleLower.includes('open water')) return true;
      if (specialty === 'advanced' && roleLower.includes('advanced')) return true;
      if (specialty === 'technical' && roleLower.includes('technical')) return true;
      if (specialty === 'photography' && roleLower.includes('photo')) return true;

      return false;
    });
  }, [specialty]);

  const resetFilters = () => {
    setSpecialty('all');
  };

  return {
    members,
    specialty,
    setSpecialty,
    resetFilters,
    filteredCount: members.length,
    totalCount: TEAM_MEMBERS.length,
  };
};
