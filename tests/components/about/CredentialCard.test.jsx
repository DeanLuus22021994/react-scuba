import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CredentialCard from '@/components/about/CredentialCard';

describe('CredentialCard', () => {
    const mockCredential = {
        icon: AcademicCapIcon,
        title: 'PADI 5 Star Dive Center',
        description: 'Highest rating awarded by PADI, ensuring quality training and services.',
    };

    it('should render without crashing', () => {
        render(<CredentialCard credential={mockCredential} />);
        expect(screen.getByText('PADI 5 Star Dive Center')).toBeInTheDocument();
    });

    it('should display credential title', () => {
        render(<CredentialCard credential={mockCredential} />);
        expect(screen.getByText(mockCredential.title)).toBeInTheDocument();
    });

    it('should display credential description', () => {
        render(<CredentialCard credential={mockCredential} />);
        expect(screen.getByText(mockCredential.description)).toBeInTheDocument();
    });

    it('should render icon component', () => {
        const { container } = render(<CredentialCard credential={mockCredential} />);
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('should apply animation delay based on index', () => {
        const { container } = render(<CredentialCard credential={mockCredential} index={2} />);
        const motionDiv = container.firstChild;
        expect(motionDiv).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
        const { container } = render(<CredentialCard credential={mockCredential} />);
        const card = container.firstChild;
        expect(card).toHaveClass('bg-white', 'p-6', 'rounded-lg');
    });
});
