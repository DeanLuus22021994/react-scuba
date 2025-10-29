# React Scuba Web App - Copilot Instructions

## Workspace: @react-scuba/web

This is the **React 19 frontend application** built with **Vite 7** and **TypeScript**.

## Tech Stack
- **React 19.2** (latest features: automatic batching, transitions, Suspense)
- **Vite 7.1.11** (with @vitejs/plugin-react-swc for faster builds)
- **TypeScript 5.9.3** (strict mode enabled)
- **Tailwind CSS 4** (utility-first CSS framework)
- **React Router v7** (file-based routing with lazy loading)
- **TanStack Query v5** (server state management, caching)
- **Zustand** (lightweight client state management)
- **Framer Motion** (declarative animations)
- **React Hook Form + Zod** (forms with type-safe validation)

## Key Directories
```
apps/web/
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-based modules
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Third-party integrations
│   ├── pages/             # Route components
│   ├── services/          # API clients (TanStack Query)
│   ├── store/             # Zustand stores
│   ├── styles/            # Global Tailwind imports
│   └── utils/             # Helper functions
├── public/                # Static assets (copied to dist)
├── tests/                 # Vitest + Playwright tests
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind customization
└── tsconfig.json          # TypeScript configuration
```

## Code Patterns

### Component Structure
```tsx
import { useState } from 'react';
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Component logic */}
    </div>
  );
};
```

### Custom Hooks
```tsx
import { useQuery } from '@tanstack/react-query';

export const useDiveTrips = (clientId: string) => {
  return useQuery({
    queryKey: ['diveTrips', clientId],
    queryFn: () => fetchDiveTrips(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### API Integration (TanStack Query)
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingData) => api.post('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
```

### Multi-Tenant Resolution
```tsx
import { useClient } from '@react-scuba/content';

export const HomePage = () => {
  const client = useClient(); // Resolves from subdomain/domain

  return (
    <div style={{ color: client.theme.colors.primary }}>
      <h1>{client.name}</h1>
    </div>
  );
};
```

## Testing

### Unit Tests (Vitest + Testing Library)
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test Title" onSubmit={() => {}} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('user can book a dive trip', async ({ page }) => {
  await page.goto('/trips');
  await page.click('text=Book Now');
  await page.fill('[name="name"]', 'John Doe');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Build & Development

```bash
# Development (hot reload)
npm run dev

# Build (production)
npm run build
npm run build:prod        # With optimizations
npm run build:analyze     # With bundle analysis

# Preview production build
npm run preview

# Testing
npm test                  # Vitest watch mode
npm run test:coverage     # Coverage report
npx playwright test       # E2E tests
```

## Performance Best Practices
- **Lazy load routes**: Use `React.lazy()` for code splitting
- **Memoize expensive computations**: Use `useMemo`, `useCallback`
- **Optimize images**: Use WebP format, lazy loading
- **Bundle analysis**: Run `npm run build:analyze` to check bundle size
- **TanStack Query caching**: Set appropriate `staleTime` and `cacheTime`

## Common Issues
- **Build fails**: Check TypeScript errors with `npm run type-check`
- **Slow dev server**: Clear cache with `rm -rf node_modules/.vite`
- **Module not found**: Verify path aliases in `tsconfig.json` and `vite.config.js`

## Copilot Output Guidelines

**IMPORTANT**: Do NOT generate summary documents, changelog files, or markdown reports unless explicitly requested. Provide only enterprise-focused explicit output for tasks. Make changes directly without documentation overhead.
