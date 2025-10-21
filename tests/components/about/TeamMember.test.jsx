import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TeamMember from '../../src/components/about/TeamMember';

describe('TeamMember', () => {
    const mockMember = {
        name: 'Jean-Pierre Rousseau',
        role: 'Master Instructor & Founder',
        certifications: ['PADI Master Instructor', 'EFR Instructor Trainer', '15+ years experience'],
        image: 'https://example.com/image.jpg',
        bio: 'Started diving in 2008 and has been sharing the passion for underwater exploration ever since.',
    };

    it('should render without crashing', () => {
        render(<TeamMember member={mockMember} />);
        expect(screen.getByText(mockMember.name)).toBeInTheDocument();
    });

    it('should display member name', () => {
        render(<TeamMember member={mockMember} />);
        expect(screen.getByText(mockMember.name)).toBeInTheDocument();
    });

    it('should display member role', () => {
        render(<TeamMember member={mockMember} />);
        expect(screen.getByText(mockMember.role)).toBeInTheDocument();
    });

    it('should display member bio', () => {
        render(<TeamMember member={mockMember} />);
        expect(screen.getByText(mockMember.bio)).toBeInTheDocument();
    });

    it('should render member image with correct alt text', () => {
        render(<TeamMember member={mockMember} />);
        const image = screen.getByAltText(mockMember.name);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockMember.image);
    });

    it('should display all certifications', () => {
        render(<TeamMember member={mockMember} />);
        mockMember.certifications.forEach((cert) => {
            expect(screen.getByText(cert)).toBeInTheDocument();
        });
    });

    it('should have proper styling classes', () => {
        const { container } = render(<TeamMember member={mockMember} />);
        const card = container.firstChild;
        expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg');
    });
});
