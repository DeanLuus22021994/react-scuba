import { describe, expect, it } from 'vitest';
import * as homeExports from '../../src/components/home/index';

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

  it('should export TestimonialsSection', () => {
    expect(homeExports.TestimonialsSection).toBeDefined();
  });
});
