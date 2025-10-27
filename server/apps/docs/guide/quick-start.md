# Quick Start

<div class="feature-card">

🚀 Get React Scuba up and running in under **5 minutes**.

</div>

## Prerequisites

Ensure you have installed:

<div class="metrics">
  <div class="metric">
    <span class="metric-value">18+</span>
    <span class="metric-label">Node.js</span>
  </div>
  <div class="metric">
    <span class="metric-value">9+</span>
    <span class="metric-label">npm</span>
  </div>
  <div class="metric">
    <span class="metric-value">✓</span>
    <span class="metric-label">Git</span>
  </div>
</div>

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
✓ src/reference/components/common/ErrorBoundary.test.jsx (3)

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
