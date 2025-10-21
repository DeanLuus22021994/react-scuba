import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CourseComparison from '@/components/courses/CourseComparison';
import { CurrencyProvider } from '@/hooks/useCurrency';

describe('CourseComparison', () => {
    const renderWithProvider = (component) => {
        return render(<CurrencyProvider>{component}</CurrencyProvider>);
    };

    it('should render without crashing', async () => {
        renderWithProvider(<CourseComparison />);
        await waitFor(() => {
            expect(screen.getByText('Course Comparison')).toBeInTheDocument();
        });
    });

    it('should display table headers', async () => {
        renderWithProvider(<CourseComparison />);
        await waitFor(() => {
            expect(screen.getByText('Course')).toBeInTheDocument();
            expect(screen.getByText('Duration')).toBeInTheDocument();
            expect(screen.getByText('Min Age')).toBeInTheDocument();
            expect(screen.getByText('Prerequisites')).toBeInTheDocument();
            expect(screen.getByText('Max Depth')).toBeInTheDocument();
            expect(screen.getByText('Price')).toBeInTheDocument();
        });
    });

    it('should display course rows', async () => {
        renderWithProvider(<CourseComparison />);
        await waitFor(() => {
            expect(screen.getByText('Open Water Diver')).toBeInTheDocument();
        });
    });

    it('should display course data in table format', async () => {
        renderWithProvider(<CourseComparison />);
        await waitFor(() => {
            const table = screen.getByRole('table');
            expect(table).toBeInTheDocument();
        });
    });

    it('should have proper table structure', async () => {
        renderWithProvider(<CourseComparison />);
        await waitFor(() => {
            const headers = screen.getAllByRole('columnheader');
            expect(headers.length).toBeGreaterThan(0);
        });
    });
});
