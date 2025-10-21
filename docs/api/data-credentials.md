# Credentials Data

The credentials data structure contains information about Ocean Spirit Scuba's certifications, awards, and professional qualifications displayed on the website.

## Credentials Structure

Each credential object contains the following properties:

```javascript
{
  icon: AcademicCapIcon,                    // Heroicons component
  title: 'PADI 5 Star Dive Center',         // Credential title
  description: 'Highest rating awarded...' // Detailed description
}
```

## Available Credentials

### CREDENTIALS Array

```javascript
import { CREDENTIALS } from '@/data/credentials';

// Access all credentials
console.log(CREDENTIALS.length); // 4 credentials
```

### Credentials List

| Icon              | Title                   | Description                                                              |
| ----------------- | ----------------------- | ------------------------------------------------------------------------ |
| `AcademicCapIcon` | PADI 5 Star Dive Center | Highest rating awarded by PADI, ensuring quality training and services.  |
| `ShieldCheckIcon` | Fully Insured           | Comprehensive dive insurance and liability coverage for all activities.  |
| `UserGroupIcon`   | Experienced Team        | 50+ years combined diving experience across all instructors.             |
| `TrophyIcon`      | Award Winning           | Recognized as Mauritius's top-rated dive center for 3 consecutive years. |

## Usage in Components

### Credentials Display Component

```javascript
import { CREDENTIALS } from '@/data/credentials';

function CredentialsSection() {
  return (
    <section className="credentials-section">
      <h2>Why Choose Ocean Spirit Scuba?</h2>
      <div className="credentials-grid">
        {CREDENTIALS.map((credential, index) => {
          const IconComponent = credential.icon;
          return (
            <div key={index} className="credential-card">
              <IconComponent className="credential-icon" />
              <h3>{credential.title}</h3>
              <p>{credential.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

### Individual Credential Component

```javascript
import { CREDENTIALS } from '@/data/credentials';

function CredentialCard({ index }) {
  const credential = CREDENTIALS[index];
  const IconComponent = credential.icon;

  return (
    <div className="credential-card">
      <div className="icon-container">
        <IconComponent size={48} />
      </div>
      <div className="content">
        <h3 className="title">{credential.title}</h3>
        <p className="description">{credential.description}</p>
      </div>
    </div>
  );
}
```

## Icon Components

The credentials use Heroicons from `@heroicons/react/24/outline`:

```javascript
import {
  AcademicCapIcon, // Education/certification icon
  ShieldCheckIcon, // Insurance/security icon
  TrophyIcon, // Award icon
  UserGroupIcon, // Team/people icon
} from '@heroicons/react/24/outline';
```

## Credential Details

### PADI 5 Star Dive Center

- **Icon:** AcademicCapIcon
- **Description:** Highest rating awarded by PADI, ensuring quality training and services
- **Significance:** Only 5% of dive centers worldwide achieve this rating

### Fully Insured

- **Icon:** ShieldCheckIcon
- **Description:** Comprehensive dive insurance and liability coverage for all activities
- **Coverage:** Includes dive accidents, equipment damage, and third-party liability

### Experienced Team

- **Icon:** UserGroupIcon
- **Description:** 50+ years combined diving experience across all instructors
- **Qualifications:** All instructors are PADI certified with extensive local knowledge

### Award Winning

- **Icon:** TrophyIcon
- **Description:** Recognized as Mauritius's top-rated dive center for 3 consecutive years
- **Source:** Based on customer reviews and PADI evaluations

## Styling

### CSS Classes

```css
.credentials-section {
  padding: 4rem 0;
  background: var(--background-secondary);
}

.credentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.credential-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.credential-icon {
  width: 3rem;
  height: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .credentials-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .credential-card {
    padding: 1.5rem;
  }
}
```

## Accessibility

- Icons include proper ARIA labels
- Color contrast meets WCAG guidelines
- Keyboard navigation supported
- Screen reader friendly descriptions

## Related

- [Team Data](/api/data-team.md)
- [Ocean Spirit Data](/api/data-ocean-spirit.md)
