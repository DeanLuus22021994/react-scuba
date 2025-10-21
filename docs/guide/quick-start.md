# Quick Start

Get React Scuba up and running in under 5 minutes.

## Prerequisites

Ensure you have installed:

- **Node.js** 18.x or later ([Download](https://nodejs.org/))
- **npm** 9.x or later (comes with Node.js)
- **Git** for version control

::: tip Check Your Versions

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

:::

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages. Takes 2-5 minutes depending on your connection.

### 3. Configure Environment

Create your environment file:

```bash
cp .env.example .env.local
```

**Minimum configuration** for development (optional services):

```env
# App Configuration
VITE_APP_URL=http://localhost:3000

# Optional: Google Services (can skip for local dev)
# VITE_GTM_ID=GTM-XXXXXXX
# VITE_GA4_ID=G-XXXXXXXXXX
# VITE_RECAPTCHA_SITE_KEY=your_key_here

# Optional: API Endpoint
# VITE_API_ENDPOINT=https://api.example.com
```

::: info Note
Google services are optional for local development. The app works fine without them!
:::

### 4. Start Development Server

```bash
npm start
```

You should see:

```bash
  VITE v6.3.6  ready in 542 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the React Scuba homepage! 🎉

## Verify Installation

### Run Tests

```bash
npm test
```

All tests should pass:

```bash
✓ src/App.test.jsx (1)
✓ src/components/common/ErrorBoundary.test.jsx (3)

Test Files  2 passed (2)
Tests  4 passed (4)
```

### Check Linting

```bash
npm run lint
```

Should show no errors (some warnings are OK).

### Build for Production

```bash
npm run build
```

Successful build output:

```bash
✓ built in 8.42s
dist/index.html                   0.51 kB
dist/assets/index-a1b2c3d4.css   45.22 kB
dist/assets/index-e5f6g7h8.js   347.18 kB
```

## Project Overview

After installation, your project structure looks like this:

```
react-scuba/
├── src/                    # Source code
│   ├── components/        # React components (38+)
│   ├── utils/             # Utilities (analytics, logger, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API clients
│   ├── data/              # Static data
│   └── styles/            # Global styles
├── docs/                  # Documentation (you're reading it!)
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Available Scripts

| Command            | Purpose                              |
| ------------------ | ------------------------------------ |
| `npm start`        | Start development server (port 3000) |
| `npm run build`    | Build for production                 |
| `npm test`         | Run tests in watch mode              |
| `npm run lint`     | Check code quality                   |
| `npm run format`   | Format code with Prettier            |
| `npm run docs:dev` | Start documentation server           |

## Next Steps

### Explore the Codebase

1. **Start with the entry point:** `src/App.jsx`
2. **Check out components:** `src/components/`
3. **Review utilities:** `src/utils/`
4. **Read the code:** Most files have helpful comments

### Customize for Your Business

1. **Update branding:** Replace logo in `public/logo.svg`
2. **Edit content:** Modify text in component files
3. **Change colors:** Update `tailwind.config.js`
4. **Add features:** Create new components in `src/components/`

### Deploy to Production

Ready to go live?

- [Deployment Guide](/deployment/) - Multiple platform options
- [Environment Configuration](/guide/environment) - Production setup
- [Performance Optimization](/guide/performance) - Speed tips

## Common Issues

### Port Already in Use

If port 3000 is busy:

```bash
npm start -- --port 3001
```

### Dependency Conflicts

If you see peer dependency warnings:

```bash
npm install --legacy-peer-deps
```

### Build Failures

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Import Errors

Make sure you're using the correct import paths:

```javascript
// ✅ Correct
import { logger } from '@/utils';
import Header from '@/layouts/Header';

// ❌ Wrong
import logger from '../../../utils/logger';
```

## Development Tips

### Use Barrel Exports

Import from index files for cleaner code:

```javascript
// Good
import { HeroSection, ServicesSection } from '@/components/home';

// Also works, but verbose
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
```

### Hot Module Replacement

Changes to `.jsx` and `.css` files reload instantly without full page refresh. Try it:

1. Open `src/components/home/HeroSection.jsx`
2. Change the title text
3. Watch it update in the browser instantly!

### Dev Tools

Install these VS Code extensions:

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## Getting Help

Stuck? Here's how to get help:

1. **Check the docs** - Start with [Full Installation Guide](/guide/installation)
2. **Search issues** - [GitHub Issues](https://github.com/DeanLuus22021994/react-scuba/issues)
3. **Ask questions** - [GitHub Discussions](https://github.com/DeanLuus22021994/react-scuba/discussions)
4. **Read the code** - Components are well-documented with comments

## What's Next?

::: tip Choose Your Path
**Learning Path:**

1. [Project Structure](/guide/structure) - Understand the architecture
2. [Components Guide](/components/) - Explore 38+ components
3. [API Reference](/api/) - Utilities, hooks, and services

**Production Path:**

1. [Environment Variables](/guide/environment) - Configure for production
2. [Performance Guide](/guide/performance) - Optimize for speed
3. [Deployment Guide](/deployment/) - Go live
   :::

---

**Total Setup Time:** ~5 minutes • **Difficulty:** Beginner-friendly • **Support:** Active
