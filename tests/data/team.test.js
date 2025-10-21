import { getTeamMemberByName, TEAM_MEMBERS } from '@/data/team';
import { describe, expect, it } from 'vitest';

describe('team', () => {
  it('should export TEAM_MEMBERS array', () => {
    expect(TEAM_MEMBERS).toBeDefined();
    expect(Array.isArray(TEAM_MEMBERS)).toBe(true);
    expect(TEAM_MEMBERS.length).toBeGreaterThan(0);
  });

  it('should have valid team member structure', () => {
    TEAM_MEMBERS.forEach((member) => {
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('role');
      expect(member).toHaveProperty('certifications');
      expect(member).toHaveProperty('image');
      expect(member).toHaveProperty('bio');
    });
  });

  it('should export getTeamMemberByName function', () => {
    expect(getTeamMemberByName).toBeDefined();
    expect(typeof getTeamMemberByName).toBe('function');
  });

  it('should find team member by name', () => {
    const member = getTeamMemberByName('Raj Patel');
    expect(member).toBeDefined();
    expect(member.name).toBe('Raj Patel');
  });
});
