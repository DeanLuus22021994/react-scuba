# React Scuba Utils Package - Copilot Instructions

## Workspace: @react-scuba/utils

This package contains **shared utility functions** (pure JavaScript/TypeScript).

## Utilities

- **formatDate**: Date formatting (locale-aware)
- **calculatePrice**: Price calculations with currency
- **validateEmail**: Email validation
- **generateId**: UUID generation

## Usage

```typescript
import { formatDate, calculatePrice } from '@react-scuba/utils';

const formattedDate = formatDate(new Date(), 'en-US');
const totalPrice = calculatePrice(basePrice, taxRate);
```

## Copilot Output Guidelines

**IMPORTANT**: Do NOT generate summary documents, changelog files, or markdown reports unless explicitly requested. Provide only enterprise-focused explicit output for tasks. Make changes directly without documentation overhead.
