import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/connection.js';

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 255 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 50 }),
  body('subject').optional().trim().isLength({ max: 255 }),
  body('message').trim().isLength({ min: 10, max: 5000 }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST create contact submission
router.post('/', validateContact, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({
      message: 'Contact submission received successfully',
      contactId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// GET all contacts (admin endpoint - add auth later)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let queryStr = 'SELECT * FROM contacts';
    const params = [];

    if (status) {
      queryStr += ' WHERE status = ?';
      params.push(status);
    }

    queryStr += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));

    const [contacts] = await pool.query(queryStr, params);
    res.json({ contacts, count: contacts.length });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

export default router;
