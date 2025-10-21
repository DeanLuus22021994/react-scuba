# Installation

This guide covers the complete installation process for the SCUBA Bali project.

## System Requirements

### Minimum Requirements

- **Node.js:** 18.0.0 or later
- **npm:** 9.0.0 or later
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 500MB for dependencies

### Recommended Setup

- **Node.js:** 20.x LTS
- **npm:** 10.x
- **OS:** macOS, Linux, or Windows with WSL2
- **Editor:** VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

## Installation Steps

### 1. Check Node.js Version

```bash
node --version
# Should output v18.x.x or higher

npm --version
# Should output 9.x.x or higher
```

If you need to install or update Node.js:

- **macOS/Linux:** Use [nvm](https://github.com/nvm-sh/nvm)
- **Windows:** Download from [nodejs.org](https://nodejs.org/)

### 2. Clone Repository

```bash
# Using HTTPS
git clone https://github.com/DeanLuus22021994/react-scuba.git

# Or using SSH
git clone git@github.com:DeanLuus22021994/react-scuba.git

# Navigate to project
cd react-scuba
```

### 3. Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`. The process may take 2-5 minutes depending on your internet speed.

#### What Gets Installed

**Core Dependencies:**

- `react` (19.0.0) - UI library
- `react-dom` (19.0.0) - DOM rendering
- `react-router` (7.1.0) - Routing
- `vite` (6.3.6) - Build tool

**Styling:**

- `tailwindcss` (3.4.17) - CSS framework
- `autoprefixer` (10.4.20) - CSS vendor prefixes
- `postcss` (8.5.1) - CSS processor

**UI Components:**

- `@headlessui/react` (2.2.9) - Accessible components
- `@heroicons/react` (2.2.0) - Icon library
- `framer-motion` (11.18.0) - Animations

**Forms & Validation:**

- `react-hook-form` (7.54.2) - Form management
- `zod` (3.24.1) - Schema validation

**Maps & Location:**

- `react-leaflet` (4.2.1) - Interactive maps
- `leaflet` (1.9.4) - Mapping library

And more...

### 4. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Development
VITE_APP_URL=http://localhost:5173

# Google Services (optional for development)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_site_key_here

# API Endpoints
VITE_API_BASE_URL=https://api.example.com
```

> **Note:** Google services are optional for local development.

### 5. Verify Installation

```bash
# Start development server
npm run dev
```

You should see:

```bash
  VITE v6.3.6  ready in X ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open `http://localhost:5173` in your browser. You should see the SCUBA Bali homepage.

## Troubleshooting

### Port Already in Use

If port 5173 is busy:

```bash
# Use a different port
npm run dev -- --port 3000
```

### Peer Dependency Warnings

If you see peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

### Build Failures

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "css.lint.unknownAtRules": "ignore",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Documentation Development

To work on documentation:

```bash
# Install VitePress (if not already installed)
npm install -D vitepress --legacy-peer-deps

# Start docs dev server
npm run docs:dev
```

## Next Steps

- [Project Structure](./structure.md) - Understand the codebase
- [Configuration](./configuration.md) - Configure the app
- [Development Workflow](./workflow.md) - Learn the workflow
