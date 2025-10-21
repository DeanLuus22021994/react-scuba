# Build Scripts

This directory contains utility scripts for maintaining and building the React Scuba project.

## Available Scripts

### 🎨 CSS Consolidation Tool

**Purpose:** Consolidates multiple CSS files into a single `index.css` to resolve PostCSS `@import` ordering warnings in Tailwind v4.

**File:** `consolidate-css.js`

#### Usage

```bash
# Run directly
node scripts/consolidate-css.js

# Or use npm script
npm run consolidate:css
```

#### What It Does

1. **Reads CSS Files** from `src/styles/`:
   - `index.css` - Base styles
   - `utilities.css` - Custom utility classes
   - `components.css` - Component-specific styles
   - `animations.css` - Keyframe animations

2. **Consolidates** into `src/index.css`:
   - Adds Tailwind v4 imports at the top
   - Includes `@config` directive
   - Maintains proper section headers
   - Eliminates nested `@import` statements

3. **Creates Backup**:
   - Saves existing `index.css` as `index.css.backup`
   - Allows easy rollback if needed

4. **Provides Statistics**:
   - Total lines
   - File size
   - Number of files merged

#### When to Use

Run this script whenever you:

- 🔧 Modify CSS files in `src/styles/`
- ➕ Add new CSS files to consolidate
- 🔄 Update Tailwind configuration
- ⚠️ Encounter PostCSS `@import` warnings
- 🧹 Want to ensure CSS is properly organized

#### Output Example

```
🎨 CSS Consolidation Tool

================================

📋 Backed up existing index.css

📖 Reading CSS files:

   - index.css
   - utilities.css
   - components.css
   - animations.css

✅ Consolidation complete!

================================

📄 Output: src/index.css
📏 Lines: 2,265
💾 Size: 53.47 KB
📦 Files merged: 4

💡 Backup saved: src/index.css.backup
   Restore with: mv src/index.css.backup src/index.css

✨ Ready for build!
```

#### Restoring Backup

If you need to restore the previous version:

```bash
mv src/index.css.backup src/index.css
```

#### Customization

To add or reorder CSS files, edit the `CSS_FILES` array in `consolidate-css.js`:

```javascript
const CSS_FILES = [
  'index.css',
  'utilities.css',
  'components.css',
  'animations.css',
  // Add your new CSS file here
  'custom.css',
];
```

## Adding New Scripts

When adding new scripts to this directory:

1. **Create the script file** with a descriptive name
2. **Add shebang** for Node.js: `#!/usr/bin/env node`
3. **Make executable**: `chmod +x scripts/your-script.js`
4. **Add npm script** in `package.json`:
   ```json
   "scripts": {
     "your-script": "node scripts/your-script.js"
   }
   ```
5. **Document it** in this README

## Best Practices

- ✅ Always test scripts in a feature branch first
- ✅ Create backups before modifying files
- ✅ Provide clear error messages
- ✅ Include usage examples
- ✅ Add validation checks
- ✅ Log progress and results

## Troubleshooting

### Script Won't Run

```bash
# Make script executable
chmod +x scripts/consolidate-css.js

# Or run with node directly
node scripts/consolidate-css.js
```

### Module Not Found

```bash
# Ensure you're in project root
cd /workspaces/react-scuba

# Then run script
npm run consolidate:css
```

### CSS Files Missing

Check that all files exist in `src/styles/`:

```bash
ls -la src/styles/
```

## Contributing

When contributing new scripts:

1. Follow existing code style
2. Add comprehensive comments
3. Include error handling
4. Update this README
5. Test thoroughly before committing
