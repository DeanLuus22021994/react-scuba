# Multi-Tenant Team Images

This directory contains team member images for the multi-tenant dive center platform.

## Structure

Images are organized by client tenant:

```text
team/
├── client-slug-1/
│   ├── instructor-1.jpg
│   └── instructor-2.jpg
└── client-slug-2/
    ├── team-member-1.jpg
    └── team-member-2.jpg
```

## Multi-Tenant Configuration

Team members are defined in each client's `config.json` file:

```json
{
  "team": [
    {
      "id": "team-member-id",
      "name": "Team Member Name", 
      "role": "Instructor/Role",
      "image": "/clients/[client-slug]/images/team/member.jpg"
    }
  ]
}
```

## Image Guidelines

- **Format**: JPG or PNG
- **Dimensions**: Minimum 800x800px (square or portrait orientation)
- **Quality**: High resolution for web display
- **Style**: Professional diving photos showing team members in action

## Usage

Images are dynamically loaded based on tenant configuration:

```typescript
// Team images are resolved via @react-scuba/content
import { useTenantConfig } from '@react-scuba/content/react';

const { config } = useTenantConfig();
const teamImages = config.team.map(member => member.image);
```

Displayed in the About page Team section with automatic tenant resolution.
