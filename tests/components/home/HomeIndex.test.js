import { describe, expect, it } from 'vitest';
import * as homeExports from '../../../src/components/home/index';

describe('components/home/index', () => {
  it('should export CTASection', () => {
    expect(homeExports.CTASection).toBeDefined();
  });

  it('should export FeaturesSection', () => {
    expect(homeExports.FeaturesSection).toBeDefined();
  });

  it('should export HeroSection', () => {
    expect(homeExports.HeroSection).toBeDefined();
  });

  it('should export HomePage', () => {
    expect(homeExports.HomePage).toBeDefined();
  });

  it('should export ServicesSection', () => {
    expect(homeExports.ServicesSection).toBeDefined();
  });

  it('should export SpecialOffersSection', () => {
    expect(homeExports.SpecialOffersSection).toBeDefined();
  });

  it('should export TestimonialsSection', () => {
    expect(homeExports.TestimonialsSection).toBeDefined();
  });

  it('should export VideoSection', () => {
    expect(homeExports.VideoSection).toBeDefined();
  });

  it('should have correct number of exports', () => {
    const exportKeys = Object.keys(homeExports);
    expect(exportKeys).toHaveLength(8);
  });
});
