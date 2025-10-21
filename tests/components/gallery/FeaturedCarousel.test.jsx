import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FeaturedCarousel from '@/components/gallery/FeaturedCarousel';

// Mock Swiper
vi.mock('swiper/react', () => ({
    Swiper: vi.fn(({ children }) => <div data-testid="swiper">{children}</div>),
    SwiperSlide: vi.fn(({ children }) => <div data-testid="swiper-slide">{children}</div>),
}));

vi.mock('swiper/modules', () => ({
    Navigation: vi.fn(),
    Pagination: vi.fn(),
    Autoplay: vi.fn(),
}));

describe('FeaturedCarousel', () => {
    it('should render without crashing', () => {
        render(<FeaturedCarousel />);
        expect(screen.getByText('Featured Highlights')).toBeInTheDocument();
    });

    it('should display heading', () => {
        render(<FeaturedCarousel />);
        expect(screen.getByText('Featured Highlights')).toBeInTheDocument();
        expect(screen.getByText('Our best shots from recent dives')).toBeInTheDocument();
    });

    it('should render Swiper component', () => {
        const { getByTestId } = render(<FeaturedCarousel />);
        expect(getByTestId('swiper')).toBeInTheDocument();
    });
});
