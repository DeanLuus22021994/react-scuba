import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from '../../../src/components/common/Loading';

describe('Loading', () => {
    it('should render without crashing', () => {
        render(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display loading text', () => {
        render(<Loading text="Please wait..." />);
        expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should render with default text', () => {
        render(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not display text when text prop is empty', () => {
        render(<Loading text="" />);
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should render spinner element', () => {
        const { container } = render(<Loading />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('should apply small size class', () => {
        const { container } = render(<Loading size="sm" />);
        const spinner = container.querySelector('.w-8');
        expect(spinner).toBeInTheDocument();
    });

    it('should apply medium size class by default', () => {
        const { container } = render(<Loading />);
        const spinner = container.querySelector('.w-12');
        expect(spinner).toBeInTheDocument();
    });

    it('should apply large size class', () => {
        const { container } = render(<Loading size="lg" />);
        const spinner = container.querySelector('.w-16');
        expect(spinner).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
        const { container } = render(<Loading />);
        const wrapper = container.querySelector('.flex');
        expect(wrapper).toHaveClass('flex-col', 'items-center', 'justify-center');
    });
});
