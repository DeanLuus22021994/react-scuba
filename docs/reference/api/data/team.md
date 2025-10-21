# Team Data

The team data structure contains information about Ocean Spirit Scuba Diving Mauritius instructors, their certifications, experience, and professional backgrounds.

## Team Member Structure

Each team member object contains the following properties:

```javascript
{
  name: 'Raj Patel',                                    // Full name
  role: 'Dive Instructor',                              // Job title/role
  certifications: ['PADI Staff Instructor', ...],       // Professional certifications
  image: 'https://...',                                 // Profile image URL
  bio: 'Expert in wreck diving...'                      // Professional biography
}
```

## Team Members

### TEAM_MEMBERS Array

```javascript
import { TEAM_MEMBERS } from '@/data/team';

// Access all team members
console.log(TEAM_MEMBERS.length); // 4 team members
```

### Team Members List

| Name                     | Role                               | Key Certifications                         |
| ------------------------ | ---------------------------------- | ------------------------------------------ |
| Ocean Spirit Instructors | PADI 5 Star ECO Centre Team        | PADI 5 Star ECO Centre, Green Fins Member  |
| Ocean Spirit Team        | Dive Professionals                 | PADI Instructors, EFR Certified            |
| Raj Patel                | Dive Instructor                    | PADI Staff Instructor, Wreck Specialty     |
| Marie Laurent            | Dive Instructor & Marine Biologist | PADI Instructor, Marine Biology Specialist |

## Helper Function

### Get Team Member by Name

```javascript
import { getTeamMemberByName } from '@/data/team';

// Get specific team member details
const raj = getTeamMemberByName('Raj Patel');
console.log(raj.role); // "Dive Instructor"
console.log(raj.certifications); // ['PADI Staff Instructor', ...]
```

**Parameters:**

- `name` (string): Team member's full name

**Returns:** Team member object or `undefined` if not found

## Team Member Details

### Ocean Spirit Instructors

```javascript
const instructors = getTeamMemberByName('Ocean Spirit Instructors');
```

**Key Information:**

- **Role:** PADI 5 Star ECO Centre Team
- **Certifications:** PADI 5 Star ECO Centre, Green Fins Member, Reef-World Federation Partner
- **Bio:** Patient, skilled PADI instructors focused on safety. We know our fish and love our world. Committed to conservation, humility, respect, family values and career development.

### Ocean Spirit Team

```javascript
const team = getTeamMemberByName('Ocean Spirit Team');
```

**Key Information:**

- **Role:** Dive Professionals
- **Certifications:** PADI Instructors, EFR Certified, Green Fins Trained
- **Bio:** Friendly and sociable team providing a comfortable, club-like diving experience in Northern Mauritius with 65 great dive sites.

### Raj Patel

```javascript
const raj = getTeamMemberByName('Raj Patel');
```

**Key Information:**

- **Role:** Dive Instructor
- **Certifications:** PADI Staff Instructor, Wreck Specialty Instructor, 8 years experience
- **Bio:** Expert in wreck diving and underwater photography, leading exciting dive adventures.

### Marie Laurent

```javascript
const marie = getTeamMemberByName('Marie Laurent');
```

**Key Information:**

- **Role:** Dive Instructor & Marine Biologist
- **Certifications:** PADI Instructor, Marine Biology Specialist, 6 years experience
- **Bio:** Combines passion for marine conservation with teaching, offering unique ecological insights.

## Usage in Components

### Team Grid Component

```javascript
import { TEAM_MEMBERS } from '@/data/team';

function TeamGrid() {
  return (
    <section className="team-section">
      <h2>Meet Our Team</h2>
      <div className="team-grid">
        {TEAM_MEMBERS.map((member, index) => (
          <div key={index} className="team-member-card">
            <img src={member.image} alt={member.name} />
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              <p className="bio">{member.bio}</p>
              <div className="certifications">
                <h4>Certifications</h4>
                <ul>
                  {member.certifications.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Team Member Profile Component

```javascript
import { getTeamMemberByName } from '@/data/team';

function TeamMemberProfile({ memberName }) {
  const member = getTeamMemberByName(memberName);

  if (!member) {
    return <div>Team member not found</div>;
  }

  return (
    <div className="team-member-profile">
      <img src={member.image} alt={member.name} />
      <h1>{member.name}</h1>
      <h2>{member.role}</h2>
      <p className="bio">{member.bio}</p>

      <div className="certifications-section">
        <h3>Certifications & Experience</h3>
        <ul className="certifications-list">
          {member.certifications.map((cert, index) => (
            <li key={index} className="certification-item">
              {cert}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### Instructor Spotlight Component

```javascript
import { TEAM_MEMBERS } from '@/data/team';

function InstructorSpotlight() {
  // Filter out general team entries, show individual instructors
  const instructors = TEAM_MEMBERS.filter((member) => !member.name.includes('Ocean Spirit'));

  return (
    <section className="instructor-spotlight">
      <h2>Our Expert Instructors</h2>
      {instructors.map((instructor, index) => (
        <div key={index} className="instructor-card">
          <img src={instructor.image} alt={instructor.name} />
          <div className="instructor-details">
            <h3>{instructor.name}</h3>
            <p className="role">{instructor.role}</p>
            <p className="bio">{instructor.bio}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
```

## Complete Data Structure

```javascript
[
  {
    name: 'Ocean Spirit Instructors',
    role: 'PADI 5 Star ECO Centre Team',
    certifications: [
      'PADI 5 Star ECO Centre',
      'Green Fins Member',
      'Reef-World Federation Partner',
    ],
    image: '/photos/hero-ocean-spirit.jpg',
    bio: 'Patient, skilled PADI instructors focused on safety...',
  },
  {
    name: 'Ocean Spirit Team',
    role: 'Dive Professionals',
    certifications: ['PADI Instructors', 'EFR Certified', 'Green Fins Trained'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Friendly and sociable team providing...',
  },
  {
    name: 'Raj Patel',
    role: 'Dive Instructor',
    certifications: ['PADI Staff Instructor', 'Wreck Specialty Instructor', '8 years experience'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in wreck diving and underwater photography...',
  },
  {
    name: 'Marie Laurent',
    role: 'Dive Instructor & Marine Biologist',
    certifications: ['PADI Instructor', 'Marine Biology Specialist', '6 years experience'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Combines passion for marine conservation with teaching...',
  },
];
```

## Styling Examples

### Team Card CSS

```css
.team-member-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.team-member-card:hover {
  transform: translateY(-5px);
}

.team-member-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.member-info {
  padding: 1.5rem;
}

.member-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.role {
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.bio {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.certifications h4 {
  margin: 1rem 0 0.5rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.certifications ul {
  list-style: none;
  padding: 0;
}

.certifications li {
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.certifications li:before {
  content: '✓';
  color: var(--success-color);
  margin-right: 0.5rem;
}
```

### Team Grid Layout

```css
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
```

## Performance Considerations

- Use optimized images with proper dimensions
- Consider lazy loading for team member images
- Preload critical team member images (featured instructors)

## Accessibility

- Always include descriptive alt text for profile images
- Ensure sufficient color contrast for text
- Make certification lists screen reader friendly
- Support keyboard navigation for team member cards
