import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ScrollProgress from '../../src/components/shared/ScrollProgress';

describe('ScrollProgress', () => {
    it('should render without crashing', () => {
        const { container } = render(<ScrollProgress />);
        expect(container).toBeInTheDocument();
    });

    it('should render progress bar element', () => {
        const { container } = render(<ScrollProgress />);
        const progressBar = container.querySelector('.fixed');
        expect(progressBar).toBeInTheDocument();
    });

    it('should have correct styling classes', () => {
        const { container } = render(<ScrollProgress />);
        const progressBar = container.querySelector('.fixed');
        expect(progressBar).toHaveClass('top-0', 'left-0', 'right-0');
    });

    it('should render inner progress indicator', () => {
        const { container } = render(<ScrollProgress />);
        const indicator = container.querySelector('.bg-gradient-to-r');
        expect(indicator).toBeInTheDocument();
    });
});
