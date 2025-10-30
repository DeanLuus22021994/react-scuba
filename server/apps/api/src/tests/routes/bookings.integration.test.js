/**
 * Integration tests for booking routes
 * Tests full HTTP request/response cycle with mocked database
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bookingRoutes from '../../routes/bookings.js';
import { BookingService } from '../../services/booking.js';
import logger from '../../utils/logger.js';

// Mock dependencies
vi.mock('../../services/booking.js');
vi.mock('../../utils/logger.js');

describe('Booking Routes Integration', () => {
  let app;

  beforeEach(() => {
    // Create test Express app
    app = express();
    app.use(express.json());
    app.use('/api/bookings', bookingRoutes);

    // Add error handling middleware
    app.use((err, req, res, _next) => {
      logger.error('API Error', {
        error: err,
        method: req.method,
        url: req.url,
      });
      res.status(err.status || 500).json({
        error: {
          message: err.message || 'Internal server error',
          status: err.status || 500,
        },
      });
    });

    // Mock logger
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.debug = vi.fn();

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings with default parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          bookings: [
            { id: 1, name: 'John Doe', status: 'pending' },
            { id: 2, name: 'Jane Smith', status: 'confirmed' },
          ],
          count: 2,
          hasMore: false,
        },
      };

      BookingService.getAllBookings = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/api/bookings').expect(200);

      expect(response.body).toEqual(mockResponse.data);
      expect(BookingService.getAllBookings).toHaveBeenCalledWith({});
    });

    it('should pass query parameters to service', async () => {
      const mockResponse = {
        success: true,
        data: { bookings: [], count: 0, hasMore: false },
      };

      BookingService.getAllBookings = vi.fn().mockResolvedValue(mockResponse);

      await request(app).get('/api/bookings?status=confirmed&limit=10&offset=20').expect(200);

      expect(BookingService.getAllBookings).toHaveBeenCalledWith({
        status: 'confirmed',
        limit: '10',
        offset: '20',
      });
    });

    it('should handle service errors', async () => {
      BookingService.getAllBookings = vi
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/bookings').expect(500);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Database connection failed');
      expect(logger.error).toHaveBeenCalled();
    });

    it('should validate status query parameter', async () => {
      const response = await request(app).get('/api/bookings?status=invalid-status').expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toContain('Status filter must be');
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return specific booking', async () => {
      const mockResponse = {
        success: true,
        data: { booking: { id: 1, name: 'John Doe', status: 'pending' } },
      };

      BookingService.getBookingById = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/api/bookings/1').expect(200);

      expect(response.body).toEqual(mockResponse.data);
      expect(BookingService.getBookingById).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent booking', async () => {
      const mockResponse = {
        success: false,
        error: { message: 'Booking not found', status: 404 },
      };

      BookingService.getBookingById = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/api/bookings/999').expect(404);

      expect(response.body).toEqual({
        error: {
          message: 'Booking not found',
          status: 404,
        },
      });
    });

    it('should handle service errors', async () => {
      BookingService.getBookingById = vi.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/bookings/1').expect(500);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Database error');
    });
  });

  describe('POST /api/bookings', () => {
    const validBookingData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      preferredDate: '2025-12-15T10:00:00Z',
      participants: 2,
      bookingType: 'dive',
      diveSiteId: 'reef-dive-1',
      specialRequests: 'Vegetarian meals',
    };

    it('should create booking with valid data', async () => {
      const mockResponse = {
        success: true,
        data: {
          message: 'Booking created successfully',
          bookingId: 123,
          status: 'pending',
        },
      };

      BookingService.createBooking = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).post('/api/bookings').send(validBookingData).expect(201);

      expect(response.body).toEqual(mockResponse.data);
      const callArg = BookingService.createBooking.mock.calls[0][0];
      expect(callArg.name).toBe(validBookingData.name);
      expect(callArg.email).toBe(validBookingData.email);
      expect(callArg.bookingType).toBe(validBookingData.bookingType);
      // Date gets converted to Date object by sanitization
      expect(callArg.preferredDate).toBeInstanceOf(Date);
    });

    it('should validate required fields', async () => {
      const invalidData = { name: 'John' }; // Missing required fields

      const response = await request(app).post('/api/bookings').send(invalidData).expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
      expect(BookingService.createBooking).not.toHaveBeenCalled();
    });

    it('should sanitize input data', async () => {
      // Note: Sanitization happens during route processing via express-validator
      // The validator normalizes and sanitizes data automatically
      const dirtyData = {
        name: 'John <script>alert("xss")</script> Doe',
        email: 'JOHN@EXAMPLE.COM',
        phone: '+1234567890',
        preferredDate: '2025-12-15T10:00:00Z',
        participants: 2,
        bookingType: 'dive',
        diveSiteId: 'reef-dive-1',
        specialRequests: 'Need vegetarian meals',
      };

      const mockResponse = {
        success: true,
        data: { message: 'Booking created successfully', bookingId: 123 },
      };

      BookingService.createBooking = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).post('/api/bookings').send(dirtyData).expect(201);

      expect(BookingService.createBooking).toHaveBeenCalled();
      const sanitizedData = BookingService.createBooking.mock.calls[0][0];

      // Verify email was normalized
      expect(sanitizedData.email).toBe('john@example.com');
      // Verify dangerous HTML was removed (express-validator escape middleware)
      expect(sanitizedData.name).not.toContain('<script>');
    });

    it('should handle validation errors from service', async () => {
      const mockResponse = {
        success: false,
        error: {
          message: 'Business rule validation failed',
          status: 400,
          details: [{ field: 'preferredDate', message: 'Date is in the past' }],
        },
      };

      BookingService.createBooking = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).post('/api/bookings').send(validBookingData).expect(400);

      expect(response.body).toEqual({
        error: {
          message: 'Business rule validation failed',
          status: 400,
          details: [{ field: 'preferredDate', message: 'Date is in the past' }],
        },
      });
    });

    it('should handle service errors', async () => {
      BookingService.createBooking = vi
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).post('/api/bookings').send(validBookingData).expect(500);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Database connection failed');
    });

    it('should validate email format', async () => {
      const invalidEmail = { ...validBookingData, email: 'not-an-email' };

      const response = await request(app).post('/api/bookings').send(invalidEmail).expect(400);

      const emailError = response.body.errors.find((err) => err.path === 'email');
      expect(emailError).toBeDefined();
    });

    it('should validate booking type enum', async () => {
      const invalidType = { ...validBookingData, bookingType: 'invalid-type' };

      const response = await request(app).post('/api/bookings').send(invalidType).expect(400);

      const typeError = response.body.errors.find((err) => err.path === 'bookingType');
      expect(typeError).toBeDefined();
    });

    it('should validate participant count range', async () => {
      const tooMany = { ...validBookingData, participants: 25 };

      const response = await request(app).post('/api/bookings').send(tooMany).expect(400);

      const participantError = response.body.errors.find((err) => err.path === 'participants');
      expect(participantError).toBeDefined();
    });
  });

  describe('PATCH /api/bookings/:id/status', () => {
    it('should update booking status', async () => {
      const mockResponse = {
        success: true,
        data: {
          message: 'Booking status updated successfully',
          bookingId: 1,
          oldStatus: 'pending',
          newStatus: 'confirmed',
        },
      };

      BookingService.updateBookingStatus = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app)
        .patch('/api/bookings/1/status')
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body).toEqual(mockResponse.data);
      expect(BookingService.updateBookingStatus).toHaveBeenCalledWith('1', 'confirmed');
    });

    it('should validate status value', async () => {
      const response = await request(app)
        .patch('/api/bookings/1/status')
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.errors).toBeDefined();
      const statusError = response.body.errors.find((err) => err.path === 'status');
      expect(statusError).toBeDefined();
    });

    it('should require status field', async () => {
      const response = await request(app).patch('/api/bookings/1/status').send({}).expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should handle 404 from service', async () => {
      const mockResponse = {
        success: false,
        error: { message: 'Booking not found', status: 404 },
      };

      BookingService.updateBookingStatus = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app)
        .patch('/api/bookings/999/status')
        .send({ status: 'confirmed' })
        .expect(404);

      expect(response.body.error.message).toBe('Booking not found');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should delete booking successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          message: 'Booking deleted successfully',
          bookingId: 1,
        },
      };

      BookingService.deleteBooking = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).delete('/api/bookings/1').expect(200);

      expect(response.body).toEqual(mockResponse.data);
      expect(BookingService.deleteBooking).toHaveBeenCalledWith('1');
    });

    it('should handle 404 from service', async () => {
      const mockResponse = {
        success: false,
        error: { message: 'Booking not found', status: 404 },
      };

      BookingService.deleteBooking = vi.fn().mockResolvedValue(mockResponse);

      const response = await request(app).delete('/api/bookings/999').expect(404);

      expect(response.body.error.message).toBe('Booking not found');
    });

    it('should handle service errors', async () => {
      BookingService.deleteBooking = vi.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/bookings/1').expect(500);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Database error');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Mock a service method that throws an unexpected error
      BookingService.getAllBookings = vi.fn().mockImplementation(() => {
        throw new Error('Unexpected sync error');
      });

      const response = await request(app).get('/api/bookings').expect(500);

      expect(response.body.error.message).toBe('Unexpected sync error');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Request Logging', () => {
    it('should log successful requests', async () => {
      const mockResponse = {
        success: true,
        data: { bookings: [], count: 0, hasMore: false },
      };

      BookingService.getAllBookings = vi.fn().mockResolvedValue(mockResponse);

      await request(app).get('/api/bookings').expect(200);

      expect(logger.info).toHaveBeenCalledWith(
        'Fetching bookings',
        expect.objectContaining({
          filters: expect.any(Object),
        })
      );
    });

    it('should log request errors', async () => {
      BookingService.getAllBookings = vi.fn().mockRejectedValue(new Error('Database error'));

      await request(app).get('/api/bookings').expect(500);

      expect(logger.error).toHaveBeenCalledWith('Error in GET /bookings route', expect.any(Error));
    });
  });

  describe('Content Type Validation', () => {
    it('should reject non-JSON content for POST requests', async () => {
      const response = await request(app).post('/api/bookings').send('invalid-json').expect(400);

      // Express validation will catch missing required fields
      expect(response.body.errors).toBeDefined();
    });

    it('should accept valid JSON content', async () => {
      const mockResponse = {
        success: true,
        data: { message: 'Booking created successfully', bookingId: 123 },
      };

      BookingService.createBooking = vi.fn().mockResolvedValue(mockResponse);

      await request(app)
        .post('/api/bookings')
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            preferredDate: '2025-12-15T10:00:00Z',
            participants: 2,
            bookingType: 'dive',
          })
        )
        .expect(201);

      expect(BookingService.createBooking).toHaveBeenCalled();
    });
  });
});
