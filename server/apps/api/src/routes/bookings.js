import express from 'express';
import { BookingService } from '../services/booking.js';
import {
  bookingValidationRules,
  bookingStatusValidationRules,
  bookingQueryValidationRules,
  handleValidationErrors,
} from '../services/validation.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET all bookings (admin endpoint - add auth later)
router.get('/', bookingQueryValidationRules, handleValidationErrors, async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    logger.info('Fetching bookings', { filters, ip: req.ip });
    const result = await BookingService.getAllBookings(filters);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(result.error.status || 500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Error in GET /bookings route', error);
    next(error);
  }
});

// GET single booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    logger.info('Fetching single booking', { bookingId, ip: req.ip });

    const result = await BookingService.getBookingById(bookingId);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(result.error.status || 500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Error in GET /bookings/:id route', {
      bookingId: req.params.id,
      error,
    });
    next(error);
  }
});

// POST create new booking
router.post('/', bookingValidationRules, handleValidationErrors, async (req, res, next) => {
  try {
    logger.info('Creating new booking', {
      email: req.body.email,
      bookingType: req.body.bookingType,
      participants: req.body.participants,
      ip: req.ip,
    });

    const result = await BookingService.createBooking(req.body);

    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(result.error.status || 400).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Error in POST /bookings route', {
      bookingData: req.body,
      error,
    });
    next(error);
  }
}); // PATCH update booking status
router.patch(
  '/:id/status',
  bookingStatusValidationRules,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;

      logger.info('Updating booking status', { bookingId, status, ip: req.ip });
      const result = await BookingService.updateBookingStatus(bookingId, status);

      if (result.success) {
        res.json(result.data);
      } else {
        res.status(result.error.status || 500).json({ error: result.error });
      }
    } catch (error) {
      logger.error('Error in PATCH /bookings/:id/status route', {
        bookingId: req.params.id,
        status: req.body.status,
        error,
      });
      next(error);
    }
  }
);

// DELETE booking
router.delete('/:id', async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    logger.info('Deleting booking', { bookingId, ip: req.ip });
    const result = await BookingService.deleteBooking(bookingId);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(result.error.status || 500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('Error in DELETE /bookings/:id route', {
      bookingId: req.params.id,
      error,
    });
    next(error);
  }
});

export default router;
