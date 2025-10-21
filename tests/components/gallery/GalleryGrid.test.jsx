import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GalleryGrid from '../../../src/components/gallery/GalleryGrid';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('GalleryGrid', () => {
    const mockImages = [
        {
            id: 1,
            url: 'https://example.com/img1.jpg',
            thumbnail: 'https://example.com/thumb1.jpg',
            title: 'Image 1',
            description: 'Description 1',
            category: 'Marine Life',
        },
        {
            id: 2,
            url: 'https://example.com/img2.jpg',
            thumbnail: 'https://example.com/thumb2.jpg',
            title: 'Image 2',
            description: 'Description 2',
            category: 'Wreck',
        },
    ];

    const mockOnImageClick = vi.fn();

    it('should render without crashing', () => {
        render(<GalleryGrid images={mockImages} onImageClick={mockOnImageClick} />);
        expect(screen.getByText('Image 1')).toBeInTheDocument();
    });

    it('should render all images', () => {
        render(<GalleryGrid images={mockImages} onImageClick={mockOnImageClick} />);
        mockImages.forEach((img) => {
            expect(screen.getByText(img.title)).toBeInTheDocument();
        });
    });

    it('should display image descriptions', () => {
        render(<GalleryGrid images={mockImages} onImageClick={mockOnImageClick} />);
        mockImages.forEach((img) => {
            expect(screen.getByText(img.description)).toBeInTheDocument();
        });
    });

    it('should display image categories', () => {
        render(<GalleryGrid images={mockImages} onImageClick={mockOnImageClick} />);
        mockImages.forEach((img) => {
            expect(screen.getByText(img.category)).toBeInTheDocument();
        });
    });

    it('should have grid layout classes', () => {
        const { container } = render(<GalleryGrid images={mockImages} onImageClick={mockOnImageClick} />);
        const grid = container.firstChild;
        expect(grid).toHaveClass('grid');
    });
});
