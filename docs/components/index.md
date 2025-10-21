# Components

Comprehensive guide to all React components in the SCUBA Bali application.

## Component Categories

### Layout Components

Core layout structure used across all pages.

- [Header](./layout#header) - Navigation and branding
- [Footer](./layout#footer) - Site footer with links
- [Navigation](./layout#navigation) - Menu navigation

### Page Components

Top-level page components for each route.

- [HomePage](./pages#homepage) - Landing page
- [AboutPage](./pages#aboutpage) - Company information
- [CoursesPage](./pages#coursespage) - Course catalog
- [DiveSitesPage](./pages#divesitespage) - Dive site explorer
- [GalleryPage](./pages#gallerypage) - Photo gallery

### Shared Components

Reusable components used across pages.

- [BackToTop](./shared#backtotop) - Scroll to top button
- [ScrollProgress](./shared#scrollprogress) - Progress indicator
- [SEO](./shared#seo) - Meta tags and structured data

### Feature Components

Specific feature implementations.

- [BookingModal](./modals#bookingmodal) - Booking system
- [ContactModal](./modals#contactmodal) - Contact form
- [DiveMap](./dive-sites#divemap) - Interactive map
- [GalleryGrid](./gallery#gallerygrid) - Photo grid
- [Lightbox](./gallery#lightbox) - Image viewer

## Quick Reference

### Import Patterns

```javascript
// Layout components
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

// Page components
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";

// Shared components
import BackToTop from "@/components/shared/BackToTop";
import ScrollProgress from "@/components/shared/ScrollProgress";

// Feature components (barrel exports)
import { HeroSection, ServicesSection } from "@/components/home";
import { CourseCard, CourseComparison } from "@/components/courses";
```

### PropTypes Validation

All components include PropTypes for type checking:

```javascript
import PropTypes from "prop-types";

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
};
```

### Component Standards

✅ **Size:** < 250 lines per file
✅ **Validation:** PropTypes on all components
✅ **Exports:** Named or default exports (consistent per category)
✅ **Styling:** Tailwind CSS classes
✅ **Animations:** Framer Motion for transitions

## Component Tree

```
App
├── ScrollProgress
├── Header
│   └── Navigation
├── Router
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── ServicesSection
│   │   ├── FeaturesSection
│   │   ├── TestimonialsSection
│   │   └── CTASection
│   ├── AboutPage
│   │   ├── TeamMember
│   │   └── CredentialCard
│   ├── CoursesPage
│   │   ├── CourseCard
│   │   └── CourseComparison
│   ├── DiveSitesPage
│   │   ├── DiveMap
│   │   └── DiveSiteCard
│   └── GalleryPage
│       ├── GalleryGrid
│       ├── Lightbox
│       └── FeaturedCarousel
├── Footer
├── BackToTop
├── BookingModal (conditional)
└── ContactModal (conditional)
```

## Component Statistics

| Category   | Count   | Total Lines |
| ---------- | ------- | ----------- |
| Layout     | 3       | ~400        |
| Pages      | 5       | ~900        |
| Home       | 6       | 544         |
| About      | 2       | 105         |
| Courses    | 2       | 198         |
| Dive Sites | 2       | 200         |
| Gallery    | 3       | 282         |
| Shared     | 15+     | ~800        |
| **Total**  | **38+** | **~3,500**  |

## Next Steps

- [Layout Components](./layout.md) - Header, Footer, Navigation
- [Page Components](./pages.md) - All page-level components
- [Shared Components](./shared.md) - Reusable components
- [Modal Components](./modals.md) - Dialogs and overlays
