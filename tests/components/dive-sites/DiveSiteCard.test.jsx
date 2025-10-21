import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DiveSiteCard from '../../../src/components/dive-sites/DiveSiteCard';

describe('DiveSiteCard', () => {
    const mockSite = {
        id: 'cathedral',
        name: 'Cathedral',
        coordinates: [-20.2833, 57.5833],
        depth: '18-30m',
        visibility: '20-30m',
        difficulty: 'Intermediate',
        marineLife: ['Moray Eels', 'Lionfish', 'Octopus'],
        description: 'A stunning dive site with impressive rock formations',
        bestSeason: 'October - April',
        image: 'https://example.com/image.jpg',
        highlights: ['Cathedral-like rock formations', 'Rich marine biodiversity'],
    };

    const mockOnBookClick = vi.fn();

    it('should render without crashing', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.name)).toBeInTheDocument();
    });

    it('should display site name', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.name)).toBeInTheDocument();
    });

    it('should display site description', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.description)).toBeInTheDocument();
    });

    it('should display depth information', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.depth)).toBeInTheDocument();
    });

    it('should display visibility', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.visibility)).toBeInTheDocument();
    });

    it('should display best season', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        expect(screen.getByText(mockSite.bestSeason)).toBeInTheDocument();
    });

    it('should display all highlights', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        mockSite.highlights.forEach((highlight) => {
            expect(screen.getByText(highlight)).toBeInTheDocument();
        });
    });

    it('should display all marine life', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        mockSite.marineLife.forEach((species) => {
            expect(screen.getByText(species)).toBeInTheDocument();
        });
    });

    it('should render site image', () => {
        render(<DiveSiteCard site={mockSite} onBookClick={mockOnBookClick} />);
        const image = screen.getByAltText(mockSite.name);
        expect(image).toHaveAttribute('src', mockSite.image);
    });
});
