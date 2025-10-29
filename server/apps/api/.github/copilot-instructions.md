# React Scuba API - Copilot Instructions

## Workspace: @react-scuba/api

This is the **Express.js 5 backend API** serving the React Scuba platform.

## Tech Stack
- **Express.js 5.0.0** (Node.js 20.x)
- **PostgreSQL 17** (primary database)
- **MariaDB 11** (legacy client support)
- **Docker Compose** (local development)

## Key Directories
```
apps/api/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── bookings.js
│   │   ├── trips.js
│   │   └── users.js
│   ├── db/               # Database clients & migrations
│   │   ├── postgres.js
│   │   ├── mariadb.js
│   │   └── migrations/
│   ├── middleware/       # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── tests/                # API tests
└── index.js              # Express app entry point
```

## API Patterns

### Route Handler
```javascript
import express from 'express';
import { validateBooking } from '../middleware/validation.js';
import { bookingService } from '../services/bookingService.js';

const router = express.Router();

router.post('/bookings', validateBooking, async (req, res, next) => {
  try {
    const booking = await bookingService.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Database Access
```javascript
import { pool } from '../db/postgres.js';

export const bookingService = {
  async create(data) {
    const query = 'INSERT INTO bookings (user_id, trip_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [data.userId, data.tripId]);
    return result.rows[0];
  },
};
```

## Testing
```bash
npm test                  # Run API tests
npm run test:coverage     # Coverage report
```

## Common Commands
```bash
npm start                 # Start API server
npm run dev               # Development mode (nodemon)
```


## Copilot Output Guidelines

**IMPORTANT**: Do NOT generate summary documents, changelog files, or markdown reports unless explicitly requested. Provide only enterprise-focused explicit output for tasks. Make changes directly without documentation overhead.
