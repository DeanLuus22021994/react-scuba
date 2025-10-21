import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CourseCard from '../../../src/components/courses/CourseCard';
import { CurrencyProvider } from '../../../src/hooks/useCurrency';

describe('CourseCard', () => {
    const mockCourse = {
        id: 'open-water',
        name: 'Open Water Diver',
        tagline: 'Become a certified diver',
        price: 15000,
        duration: '3-4 days',
        minAge: 10,
        certification: 'PADI Open Water Diver',
        image: 'https://example.com/image.jpg',
        description: 'Learn to dive independently with a buddy',
        included: ['PADI eLearning', 'Equipment rental', 'Certification card'],
        curriculum: ['Theory', 'Confined water', 'Open water dives'],
    };

    const mockOnBookClick = vi.fn();

    const renderWithProvider = (component) => {
        return render(<CurrencyProvider>{component}</CurrencyProvider>);
    };

    it('should render without crashing', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(mockCourse.name)).toBeInTheDocument();
        });
    });

    it('should display course name', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(mockCourse.name)).toBeInTheDocument();
        });
    });

    it('should display course tagline', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(mockCourse.tagline)).toBeInTheDocument();
        });
    });

    it('should display course description', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
        });
    });

    it('should display course duration', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(mockCourse.duration)).toBeInTheDocument();
        });
    });

    it('should display minimum age', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            expect(screen.getByText(/10 years/)).toBeInTheDocument();
        });
    });

    it('should display included items', async () => {
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);
        await waitFor(() => {
            mockCourse.included.forEach((item) => {
                expect(screen.getByText(item)).toBeInTheDocument();
            });
        });
    });

    it('should toggle curriculum visibility', async () => {
        const user = userEvent.setup();
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);

        const toggleButton = await screen.findByText('Show Curriculum');
        await user.click(toggleButton);

        await waitFor(() => {
            expect(screen.getByText('Hide Curriculum')).toBeInTheDocument();
            mockCourse.curriculum.forEach((item) => {
                expect(screen.getByText(item)).toBeInTheDocument();
            });
        });
    });

    it('should call onBookClick when book button clicked', async () => {
        const user = userEvent.setup();
        renderWithProvider(<CourseCard course={mockCourse} onBookClick={mockOnBookClick} />);

        const bookButton = await screen.findByRole('button', { name: /Book Open Water Diver/i });
        await user.click(bookButton);

        expect(mockOnBookClick).toHaveBeenCalledWith(mockCourse);
    });
});
