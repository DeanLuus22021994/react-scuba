import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import SEO from '../../../src/components/common/SEO';

describe('SEO', () => {
    const renderWithHelmet = (component) => {
        return render(<HelmetProvider>{component}</HelmetProvider>);
    };

    it('should render without crashing', () => {
        renderWithHelmet(<SEO />);
        expect(document.title).toBeDefined();
    });

    it('should set custom title when provided', () => {
        renderWithHelmet(<SEO customTitle="Custom Title" />);
        expect(document.title).toContain('Custom');
    });

    it('should set page-specific meta tags', () => {
        renderWithHelmet(<SEO page="about" />);
        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription).toBeInTheDocument();
    });

    it('should set default meta tags for home page', () => {
        renderWithHelmet(<SEO page="home" />);
        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription).toBeInTheDocument();
    });

    it('should set Open Graph meta tags', () => {
        renderWithHelmet(<SEO />);
        const ogType = document.querySelector('meta[property="og:type"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        expect(ogType).toBeInTheDocument();
        expect(ogTitle).toBeInTheDocument();
    });

    it('should set Twitter meta tags', () => {
        renderWithHelmet(<SEO />);
        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        expect(twitterCard).toBeInTheDocument();
        expect(twitterTitle).toBeInTheDocument();
    });

    it('should set canonical link', () => {
        renderWithHelmet(<SEO />);
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical).toBeInTheDocument();
    });

    it('should set custom description when provided', () => {
        renderWithHelmet(<SEO customDescription="Custom description" />);
        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription?.getAttribute('content')).toContain('Custom description');
    });
});
