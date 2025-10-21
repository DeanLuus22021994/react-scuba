# Dive Sites Data

The dive sites data structure contains comprehensive information about scuba diving locations around Mauritius, including coordinates, marine life, difficulty levels, and diving conditions.

## Dive Site Structure

Each dive site object contains the following properties:

```javascript
{
  id: 'blue-bay',                          // Unique identifier
  name: 'Blue Bay Marine Park',             // Site name
  coordinates: [-20.4453, 57.7089],        // [latitude, longitude]
  depth: '5-12m',                          // Depth range
  visibility: 'Excellent (20-30m)',        // Typical visibility
  difficulty: 'Beginner',                  // Difficulty level
  marineLife: ['Parrotfish', 'Butterflyfish', ...], // Marine species
  description: '...',                      // Detailed description
  bestSeason: 'Year-round',                // Best diving season
  image: 'https://...',                    // Site image URL
  highlights: ['...', '...']               // Key features
}
```

## Available Dive Sites

### DIVE_SITES Array

```javascript
import { DIVE_SITES } from '@/data/diveSites';

// Access all dive sites
console.log(DIVE_SITES.length); // 5 dive sites
```

### Dive Sites List

| Site ID        | Name                 | Depth  | Difficulty            | Best Season   |
| -------------- | -------------------- | ------ | --------------------- | ------------- |
| `blue-bay`     | Blue Bay Marine Park | 5-12m  | Beginner              | Year-round    |
| `cathedral`    | The Cathedral        | 18-30m | Intermediate          | May-December  |
| `coin-de-mire` | Coin de Mire         | 15-40m | Advanced              | October-April |
| `whale-rock`   | Whale Rock           | 20-35m | Intermediate          | Year-round    |
| `holts-rocks`  | Holt's Rocks         | 12-25m | Beginner-Intermediate | Year-round    |

## Helper Functions

### Get Dive Site by ID

```javascript
import { getDiveSiteById } from '@/data/diveSites';

// Get specific dive site details
const blueBay = getDiveSiteById('blue-bay');
console.log(blueBay.name); // "Blue Bay Marine Park"
console.log(blueBay.coordinates); // [-20.4453, 57.7089]
```

**Parameters:**

- `id` (string): Dive site ID

**Returns:** Dive site object or `undefined` if not found

### Get Dive Sites by Difficulty

```javascript
import { getDiveSitesByDifficulty } from '@/data/diveSites';

// Get beginner-friendly sites
const beginnerSites = getDiveSitesByDifficulty('beginner');

// Get intermediate sites
const intermediateSites = getDiveSitesByDifficulty('intermediate');

// Get advanced sites
const advancedSites = getDiveSitesByDifficulty('advanced');
```

**Parameters:**

- `difficulty` (string): Difficulty level ('beginner', 'intermediate', 'advanced')

**Returns:** Array of dive site objects

## Map Integration

### Mauritius Center Coordinates

```javascript
import { MAURITIUS_CENTER } from '@/data/diveSites';

// Center point for Mauritius maps
const center = MAURITIUS_CENTER; // [-20.348404, 57.552152]
```

### Using with Maps

```javascript
import { DIVE_SITES, MAURITIUS_CENTER } from '@/data/diveSites';

function DiveMap() {
  return (
    <Map center={MAURITIUS_CENTER} zoom={10}>
      {DIVE_SITES.map((site) => (
        <Marker key={site.id} position={site.coordinates} title={site.name}>
          <Popup>
            <div>
              <h3>{site.name}</h3>
              <p>Depth: {site.depth}</p>
              <p>Difficulty: {site.difficulty}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </Map>
  );
}
```

## Difficulty Levels

### Difficulty Colors

```javascript
import { DIFFICULTY_COLORS } from '@/data/diveSites';

// CSS classes for difficulty badges
console.log(DIFFICULTY_COLORS);
// {
//   Beginner: 'bg-green-100 text-green-800',
//   Intermediate: 'bg-yellow-100 text-yellow-800',
//   Advanced: 'bg-red-100 text-red-800',
//   'Beginner to Intermediate': 'bg-green-100 text-green-800'
// }
```

### Difficulty Badge Component

```javascript
import { DIFFICULTY_COLORS } from '@/data/diveSites';

function DifficultyBadge({ difficulty }) {
  const colorClass = DIFFICULTY_COLORS[difficulty] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {difficulty}
    </span>
  );
}
```

## Dive Site Details

### Blue Bay Marine Park

```javascript
const blueBay = getDiveSiteById('blue-bay');
```

**Key Features:**

- **Depth:** 5-12m (perfect for beginners)
- **Visibility:** Excellent (20-30m)
- **Difficulty:** Beginner
- **Marine Life:** Parrotfish, Butterflyfish, Sea turtles, Moray eels, Coral gardens
- **Highlights:** Protected marine park, Shallow reef for training, Abundant marine life

### The Cathedral

```javascript
const cathedral = getDiveSiteById('cathedral');
```

**Key Features:**

- **Depth:** 18-30m
- **Visibility:** Very Good (15-25m)
- **Difficulty:** Intermediate
- **Marine Life:** Lobsters, Groupers, Octopus, Nudibranchs, Reef sharks
- **Highlights:** Dramatic cave formations, Light beam displays, Advanced navigation

### Coin de Mire

```javascript
const coinDeMire = getDiveSiteById('coin-de-mire');
```

**Key Features:**

- **Depth:** 15-40m
- **Visibility:** Excellent (25-35m)
- **Difficulty:** Advanced
- **Marine Life:** Barracudas, Tuna, Dolphins, Manta rays, Whale sharks (seasonal)
- **Highlights:** Big fish encounters, Drift diving, Dramatic topography

### Whale Rock

```javascript
const whaleRock = getDiveSiteById('whale-rock');
```

**Key Features:**

- **Depth:** 20-35m
- **Visibility:** Very Good (18-28m)
- **Difficulty:** Intermediate
- **Marine Life:** Sea turtles, Eagle rays, Snappers, Sweetlips, Nudibranchs
- **Highlights:** Unique rock formations, Multiple swim-throughs, Photography

### Holt's Rocks

```javascript
const holtsRocks = getDiveSiteById('holts-rocks');
```

**Key Features:**

- **Depth:** 12-25m
- **Visibility:** Good (15-20m)
- **Difficulty:** Beginner to Intermediate
- **Marine Life:** Clownfish, Lionfish, Trumpetfish, Scorpionfish, Batfish
- **Highlights:** Macro photography, Diverse fish species, Multiple levels

## Usage in Components

### Dive Sites Grid

```javascript
import { DIVE_SITES } from '@/data/diveSites';
import { DIFFICULTY_COLORS } from '@/data/diveSites';

function DiveSitesGrid() {
  return (
    <div className="dive-sites-grid">
      {DIVE_SITES.map((site) => (
        <div key={site.id} className="dive-site-card">
          <img src={site.image} alt={site.name} />
          <div className="site-info">
            <h3>{site.name}</h3>
            <div className="site-meta">
              <span className="depth">Depth: {site.depth}</span>
              <span className={`difficulty ${DIFFICULTY_COLORS[site.difficulty]}`}>
                {site.difficulty}
              </span>
            </div>
            <p className="description">{site.description}</p>
            <div className="highlights">
              <h4>Highlights:</h4>
              <ul>
                {site.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Dive Site Detail Page

```javascript
import { getDiveSiteById } from '@/data/diveSites';

function DiveSiteDetail({ siteId }) {
  const site = getDiveSiteById(siteId);

  if (!site) {
    return <div>Dive site not found</div>;
  }

  return (
    <div className="dive-site-detail">
      <img src={site.image} alt={site.name} />
      <h1>{site.name}</h1>

      <div className="site-overview">
        <div>Depth: {site.depth}</div>
        <div>Visibility: {site.visibility}</div>
        <div>Difficulty: {site.difficulty}</div>
        <div>Best Season: {site.bestSeason}</div>
      </div>

      <p className="description">{site.description}</p>

      <div className="marine-life">
        <h3>Marine Life</h3>
        <div className="species-grid">
          {site.marineLife.map((species, index) => (
            <span key={index} className="species-tag">
              {species}
            </span>
          ))}
        </div>
      </div>

      <div className="highlights">
        <h3>Highlights</h3>
        <ul>
          {site.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## Filtering and Search

### Filter by Difficulty

```javascript
import { getDiveSitesByDifficulty } from '@/data/diveSites';

function FilteredDiveSites({ difficulty }) {
  const sites = getDiveSitesByDifficulty(difficulty);

  return (
    <div className="filtered-sites">
      {sites.map((site) => (
        <DiveSiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
```

### Search by Marine Life

```javascript
import { DIVE_SITES } from '@/data/diveSites';

function SearchBySpecies({ species }) {
  const matchingSites = DIVE_SITES.filter((site) =>
    site.marineLife.some((animal) => animal.toLowerCase().includes(species.toLowerCase()))
  );

  return (
    <div className="search-results">
      {matchingSites.map((site) => (
        <DiveSiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
```

```

## Related

- [Maps Component](/components/maps.md)
- [Gallery Data](/api/data-gallery.md)

```
