# React Scuba Content Provider - Copilot Instructions

## Workspace: @react-scuba/content

This workspace provides **multi-tenant content resolution** for the React Scuba platform.

## Responsibilities
- **Client config resolution**: Load client config based on subdomain/domain/environment
- **Theme provider**: Inject client-specific theme variables
- **Asset management**: Resolve client-specific images/logos
- **Feature flags**: Control per-client feature availability

## Key Files
```
apps/content/
├── src/
│   ├── loaders/          # Client config loaders
│   ├── providers/        # React context providers
│   ├── resolvers/        # Domain/subdomain resolvers
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
└── README.md             # Documentation
```

## Usage Example
```tsx
import { ClientProvider, useClient } from '@react-scuba/content';

// In your app root
<ClientProvider>
  <App />
</ClientProvider>

// In any component
const MyComponent = () => {
  const client = useClient();
  return <div style={{ color: client.theme.colors.primary }}>{client.name}</div>;
};
```

## Client Config Schema
See `server/clients/_template/config.json` for the full schema.
