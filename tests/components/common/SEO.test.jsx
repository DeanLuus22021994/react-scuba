import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import SEO from '../../../src/components/ui/SEO';

describe('SEO', () => {
  const renderWithHelmet = (component) => {
    return render(<HelmetProvider>{component}</HelmetProvider>);
  };

  it('should render without crashing', () => {
    renderWithHelmet(<SEO />);
    expect(document.title).toBeDefined();
  });

  it('should set custom title when provided', async () => {
    renderWithHelmet(<SEO customTitle="Custom Title" />);
    await waitFor(() => {
      expect(document.title).toContain('Custom');
    });
  });

  it('should set page-specific meta tags', async () => {
    renderWithHelmet(<SEO page="about" />);
    await waitFor(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription?.getAttribute('content')).toBeTruthy();
    });
  });

  it('should set default meta tags for home page', async () => {
    renderWithHelmet(<SEO page="home" />);
    await waitFor(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription?.getAttribute('content')).toBeTruthy();
    });
  });

  it('should set Open Graph meta tags', async () => {
    renderWithHelmet(<SEO />);
    await waitFor(() => {
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogType).toBeTruthy();
      expect(ogTitle).toBeTruthy();
    });
  });

  it('should set Twitter meta tags', async () => {
    renderWithHelmet(<SEO />);
    await waitFor(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twitterCard).toBeTruthy();
      expect(twitterTitle).toBeTruthy();
    });
  });

  it('should set canonical link', async () => {
    renderWithHelmet(<SEO />);
    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
    });
  });

  it('should set custom description when provided', async () => {
    renderWithHelmet(<SEO customDescription="Custom description" />);
    await waitFor(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toBeTruthy();
      const content = metaDescription?.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toContain('Custom');
    });
  });
});
