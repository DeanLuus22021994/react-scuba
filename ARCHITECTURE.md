# Project Structure Documentation

## 📁 Reorganized Architecture

The codebase has been decomposed into maintainable, modular components following React best practices. Large files (>300 lines) have been split into focused, single-responsibility components.

## Directory Structure

```
src/
├── components/
│   ├── about/                    # About page components
│   │   ├── AboutPage.jsx         # Main about page (235 lines)
│   │   ├── TeamMember.jsx        # Team member card component
│   │   ├── CredentialCard.jsx    # Credential display component
│   │   └── index.js              # Barrel export
│   │
│   ├── courses/                  # Courses page components
│   │   ├── CoursesPage.jsx       # Main courses page (156 lines)
│   │   ├── CourseCard.jsx        # Individual course card
│   │   ├── CourseComparison.jsx  # Course comparison table
│   │   └── index.js              # Barrel export
│   │
│   ├── dive-sites/               # Dive sites page components
│   │   ├── DiveSitesPage.jsx     # Main dive sites page (185 lines)
│   │   ├── DiveMap.jsx           # Leaflet map component
│   │   ├── DiveSiteCard.jsx      # Dive site card component
│   │   └── index.js              # Barrel export
│   │
│   ├── gallery/                  # Gallery page components
│   │   ├── GalleryPage.jsx       # Main gallery page (163 lines)
│   │   ├── GalleryGrid.jsx       # Image grid with lazy loading
│   │   ├── Lightbox.jsx          # Image lightbox viewer
│   │   ├── FeaturedCarousel.jsx  # Swiper carousel
│   │   └── index.js              # Barrel export
│   │
│   ├── modals/                   # Modal components
│   │   ├── ContactModal.jsx      # Contact form modal
│   │   ├── BookingModal.jsx      # Booking modal (to be decomposed)
│   │   └── booking/              # Booking modal subcomponents
│   │       ├── BookingForm.jsx   # Main booking form
│   │       └── DateTimeSelector.jsx # Date/time picker
│   │
│   ├── common/                   # Shared components
│   │   ├── SEO.jsx
│   │   ├── Loading.jsx
│   │   ├── PhoneLink.jsx
│   │   ├── WhatsAppButton.jsx
│   │   ├── CurrencySelector.jsx
│   │   └── index.js
│   │
│   └── home/                     # Home page components
│       └── (home page components)
│
├── data/                         # Centralized data files
│   ├── courses.js                # PADI course data
│   ├── team.js                   # Team member information
│   ├── diveSites.js              # Dive site locations and details
│   ├── gallery.js                # Gallery image data
│   ├── bookingTypes.js           # Booking options data
│   ├── credentials.js            # Credentials and certifications
│   └── (other data files)
│
├── pages/                        # Page entry points (re-exports)
│   ├── HomePage.jsx
│   ├── AboutPage.jsx             # → ../components/about
│   ├── CoursesPage.jsx           # → ../components/courses
│   ├── DiveSitesPage.jsx         # → ../components/dive-sites
│   └── GalleryPage.jsx           # → ../components/gallery
│
├── hooks/                        # Custom React hooks
│   └── useCurrency.jsx
│
├── layouts/                      # Layout components
│   ├── MainLayout.jsx
│   ├── Header.jsx
│   ├── Navigation.jsx
│   └── Footer.jsx
│
├── services/                     # API services
│   └── api.js
│
├── utils/                        # Utility functions
│   ├── analytics.js
│   ├── currency.js
│   └── seo.js
│
├── styles/                       # Global styles
│   └── (style files)
│
├── App.jsx                       # Main app component
└── index.jsx                     # Entry point
```

## 🎯 Design Principles

### 1. **Component Decomposition**

Large components (>300 lines) have been split into:

- **Page Components**: Orchestrate layout and state management (~150-200 lines)
- **Feature Components**: Handle specific UI features (~50-150 lines)
- **Presentational Components**: Pure display components (<100 lines)

### 2. **Data Separation**

All static data has been moved to `/src/data/`:

- Easier to maintain and update content
- Centralized source of truth
- No mixing of data with UI logic
- Better for i18n in the future

### 3. **Single Responsibility**

Each component has one clear purpose:

- `CourseCard.jsx` - Display a single course
- `CourseComparison.jsx` - Compare all courses
- `CoursesPage.jsx` - Coordinate courses display

### 4. **Barrel Exports**

Each feature folder has an `index.js` for clean imports:

```javascript
// Instead of:
import CourseCard from "../components/courses/CourseCard";
import CourseComparison from "../components/courses/CourseComparison";

// Use:
import { CourseCard, CourseComparison } from "../components/courses";
```

## 📝 Component Guidelines

### Creating New Components

1. **Determine component type:**

   - Page component → `/src/components/[feature]/[Feature]Page.jsx`
   - Feature component → `/src/components/[feature]/[ComponentName].jsx`
   - Shared component → `/src/components/common/[ComponentName].jsx`

2. **Size guidelines:**

   - Target: <200 lines per component
   - If >250 lines, consider decomposition
   - If >300 lines, must decompose

3. **Props validation:**

   - Always use PropTypes
   - Document complex prop shapes
   - Provide default values where appropriate

4. **File naming:**
   - PascalCase for components: `CourseCard.jsx`
   - camelCase for utilities: `formatCurrency.js`
   - kebab-case for styles: `course-card.css`

### Data Files

When creating data files in `/src/data/`:

```javascript
/**
 * Brief description of the data
 * @module data/example
 */

export const DATA_CONSTANT = [
  // ... data
];

export const getItemById = (id) => {
  return DATA_CONSTANT.find((item) => item.id === id);
};

export const getItemsByCategory = (category) => {
  return DATA_CONSTANT.filter((item) => item.category === category);
};
```

## 🔄 Migration Benefits

### Before (Single Large Files)

- ❌ CoursesPage.jsx: 482 lines
- ❌ BookingModal.jsx: 469 lines
- ❌ AboutPage.jsx: 447 lines
- ❌ GalleryPage.jsx: 436 lines
- ❌ DiveSitesPage.jsx: 390 lines

### After (Modular Components)

- ✅ CoursesPage.jsx: 156 lines (+CourseCard, +CourseComparison, +courses.js)
- ✅ AboutPage.jsx: 235 lines (+TeamMember, +CredentialCard, +team.js, +credentials.js)
- ✅ GalleryPage.jsx: 163 lines (+GalleryGrid, +Lightbox, +FeaturedCarousel, +gallery.js)
- ✅ DiveSitesPage.jsx: 185 lines (+DiveMap, +DiveSiteCard, +diveSites.js)

### Advantages

1. **Maintainability**: Easier to locate and fix bugs
2. **Reusability**: Components can be used across pages
3. **Testability**: Smaller units are easier to test
4. **Collaboration**: Multiple developers can work on different components
5. **Performance**: Potential for better code splitting
6. **Readability**: Clear separation of concerns

## 🧪 Testing Strategy

Each component type should have corresponding tests:

```
src/components/courses/
├── CourseCard.jsx
├── CourseCard.test.jsx          # Unit tests
├── CourseComparison.jsx
├── CourseComparison.test.jsx
└── CoursesPage.jsx
    └── CoursesPage.test.jsx     # Integration tests
```

## 📦 Build Output

The refactored code maintains the same build output:

- Bundle size: ~1,124 kB (344 kB gzipped)
- Build time: ~4.5 seconds
- All features intact
- Zero breaking changes

## 🚀 Future Improvements

1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Storybook**: Add component documentation and visual testing
3. **TypeScript**: Migrate from PropTypes to TypeScript
4. **Unit Tests**: Add comprehensive test coverage
5. **Performance**: Implement React.memo for expensive components
6. **Accessibility**: Add comprehensive ARIA labels and keyboard navigation

## 📚 Related Documentation

- [SETUP.md](./SETUP.md) - Production deployment guide
- [ADWORDS.md](./ADWORDS.md) - Google Ads conversion tracking
- [README.md](./README.md) - Project overview

---

**Last Updated**: October 2025
**Maintained By**: Development Team
