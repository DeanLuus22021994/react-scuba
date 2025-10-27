import express from 'express';
import { body, query, validationResult } from 'express-validator';
import pool from '../db/connection.js';

const router = express.Router();

// Validation middleware
const validateBooking = [
  body('name').trim().isLength({ min: 2, max: 255 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 8, max: 50 }),
  body('preferredDate').isISO8601().toDate(),
  body('participants').isInt({ min: 1, max: 20 }),
  body('bookingType').isIn(['dive', 'course', 'discover', 'advanced']),
  body('courseId').optional().trim(),
  body('diveSiteId').optional().trim(),
  body('specialRequests').optional().trim().isLength({ max: 2000 }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all bookings (admin endpoint - add auth later)
router.get(
  '/',
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled']),
  async (req, res) => {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      let queryStr = 'SELECT * FROM bookings';
      const params = [];

      if (status) {
        queryStr += ' WHERE status = ?';
        params.push(status);
      }

      queryStr += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));

      const [bookings] = await pool.query(queryStr, params);
      res.json({ bookings, count: bookings.length });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }
);

// GET single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: bookings[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST create new booking
router.post('/', validateBooking, handleValidationErrors, async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      name,
      email,
      phone,
      preferredDate,
      participants,
      bookingType,
      courseId,
      diveSiteId,
      specialRequests,
    } = req.body;

    // Check availability
    const [dateStr] = new Date(preferredDate).toISOString().split('T');
    const [availability] = await connection.query(
      'SELECT * FROM availability WHERE date = ? FOR UPDATE',
      [dateStr]
    );

    if (availability.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Date not available for booking' });
    }

    const [avail] = availability;
    if (avail.available_slots < participants) {
      await connection.rollback();
      return res.status(400).json({
        error: 'Not enough slots available',
        available: avail.available_slots,
        requested: participants,
      });
    }

    // Create booking
    const [result] = await connection.query(
      `INSERT INTO bookings (name, email, phone, preferred_date, participants, booking_type, 
       course_id, dive_site_id, special_requests, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name,
        email,
        phone,
        dateStr,
        participants,
        bookingType,
        courseId || null,
        diveSiteId || null,
        specialRequests,
      ]
    );

    const bookingId = result.insertId;

    // Update availability
    await connection.query(
      'UPDATE availability SET booked_slots = booked_slots + ? WHERE date = ?',
      [participants, dateStr]
    );

    // Log history
    await connection.query(
      'INSERT INTO booking_history (booking_id, action, new_status, notes) VALUES (?, ?, ?, ?)',
      [bookingId, 'created', 'pending', 'Booking created via API']
    );

    await connection.commit();

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId,
      availableSlots: avail.available_slots - participants,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    connection.release();
  }
});

// PATCH update booking status
router.patch(
  '/:id/status',
  body('status').isIn(['pending', 'confirmed', 'cancelled']),
  handleValidationErrors,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { status } = req.body;
      const bookingId = req.params.id;

      // Get current booking
      const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ? FOR UPDATE', [
        bookingId,
      ]);

      if (bookings.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Booking not found' });
      }

      const [booking] = bookings;
      const oldStatus = booking.status;

      // Update booking status
      await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);

      // If cancelling, free up slots
      if (status === 'cancelled' && oldStatus !== 'cancelled') {
        await connection.query(
          'UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?',
          [booking.participants, booking.preferred_date]
        );
      }

      // Log history
      await connection.query(
        'INSERT INTO booking_history (booking_id, action, old_status, new_status) VALUES (?, ?, ?, ?)',
        [bookingId, 'status_changed', oldStatus, status]
      );

      await connection.commit();

      res.json({
        message: 'Booking status updated successfully',
        bookingId,
        oldStatus,
        newStatus: status,
      });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    } finally {
      connection.release();
    }
  }
);

// DELETE booking
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const bookingId = req.params.id;

    // Get booking info
    const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ? FOR UPDATE', [
      bookingId,
    ]);

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const [booking] = bookings;

    // Free up slots if booking wasn't already cancelled
    if (booking.status !== 'cancelled') {
      await connection.query(
        'UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?',
        [booking.participants, booking.preferred_date]
      );
    }

    // Delete booking (cascades to history)
    await connection.query('DELETE FROM bookings WHERE id = ?', [bookingId]);

    await connection.commit();

    res.json({ message: 'Booking deleted successfully', bookingId });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  } finally {
    connection.release();
  }
});

export default router;
