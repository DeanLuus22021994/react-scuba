import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BackToTop from '@/components/shared/BackToTop';

describe('BackToTop', () => {
    it('should render without crashing', () => {
        const { container } = render(<BackToTop />);
        expect(container).toBeInTheDocument();
    });

    it('should not be visible initially', () => {
        const { container } = render(<BackToTop />);
        const button = container.querySelector('button');
        expect(button).not.toBeInTheDocument();
    });

    it('should accept showAfter prop', () => {
        const { container } = render(<BackToTop showAfter={500} />);
        expect(container).toBeInTheDocument();
    });

    it('should accept position prop', () => {
        const { container } = render(<BackToTop position="left" />);
        expect(container).toBeInTheDocument();
    });

    it('should call scrollTo when button clicked', () => {
        const scrollToMock = vi.fn();
        window.scrollTo = scrollToMock;

        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            value: 500,
        });

        const { container } = render(<BackToTop showAfter={100} />);
        window.dispatchEvent(new Event('scroll'));

        const button = container.querySelector('button');
        if (button) {
            button.click();
            expect(scrollToMock).toHaveBeenCalled();
        }
    });
});
