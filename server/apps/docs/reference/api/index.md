# API Reference

Complete API documentation for the React Scuba diving application.

## Overview

This API reference provides comprehensive documentation for all utilities, services, hooks, and data structures used throughout the React Scuba application. The API is organized into logical modules for easy navigation and understanding.

## API Structure

### Services

Core service layer providing external API communication and data fetching capabilities.

- **[API Client](client.md)** - Centralized HTTP client for backend communication with axios interceptors and error handling

### Utilities

Essential utility functions for application functionality, analytics, and performance monitoring.

- **[Analytics](analytics.md)** - Google Analytics 4 integration with conversion tracking and event management
- **[Currency](currency.md)** - Multi-currency support with conversion, formatting, and exchange rate management
- **[Environment](environment.md)** - Environment variable validation and configuration management using Zod schemas
- **[Logger](logger.md)** - Structured logging utility with environment-aware log levels and formatting
- **[SEO Helpers](seo-helpers.md)** - Schema.org structured data generation and meta tag management
- **[Report Web Vitals](reportWebVitals.md)** - Core Web Vitals tracking and GA4 reporting
- **[Scroll to Anchor](scrollToAnchor.md)** - Smooth scrolling navigation utilities

### Hooks

React hooks for state management and side effects.

- **[useCurrency](use-currency.md)** - Currency state management with React Context, localStorage persistence, and conversion utilities

### Data Structures

Static data structures containing business information and content.

- **[Booking Types](data/booking-types.md)** - Available booking categories and pricing structures
- **[Courses](data/courses.md)** - Diving course offerings with pricing and curriculum details
- **[Credentials](data/credentials.md)** - Team member certifications and qualifications
- **[Dive Sites](data/dive-sites.md)** - Dive location data with coordinates and descriptions
- **[Gallery](data/gallery.md)** - Image gallery data with metadata and optimization
- **[Ocean Spirit](data/ocean-spirit.md)** - Business information and contact details
- **[Team](data/team.md)** - Team member profiles and biographies

## Quick Start

```javascript
// Import utilities
import { apiClient } from '@/services/api';
import { trackEvent } from '@/utils/analytics';
import { formatCurrency } from '@/utils/currency';
import { useCurrency } from '@/hooks/useCurrency';

// Import data
import { COURSES } from '@/data/courses';
import { TEAM_MEMBERS } from '@/data/team';
```
