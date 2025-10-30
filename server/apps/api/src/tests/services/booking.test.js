/**
 * Comprehensive test suite for BookingService
 * Tests all business logic, error handling, and edge cases
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BookingService } from '../../services/booking.js';
import pool from '../../db/connection.js';
import logger from '../../utils/logger.js';

// Mock dependencies
vi.mock('../../db/connection.js');
vi.mock('../../utils/logger.js');
vi.mock('../../services/validation.js', () => ({
  validateBookingBusinessRules: vi.fn(),
}));

describe('BookingService', () => {
  let mockConnection;
  let mockQuery;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock database connection
    mockQuery = vi.fn();
    mockConnection = {
      query: mockQuery,
      beginTransaction: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
      release: vi.fn(),
    };

    pool.query = mockQuery;
    pool.getConnection = vi.fn().mockResolvedValue(mockConnection);

    // Mock logger methods
    logger.debug = vi.fn();
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.logDatabase = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllBookings', () => {
    it('should return all bookings with default pagination', async () => {
      const mockBookings = [
        { id: 1, name: 'John Doe', status: 'pending' },
        { id: 2, name: 'Jane Smith', status: 'confirmed' },
      ];

      mockQuery.mockResolvedValue([mockBookings]);

      const result = await BookingService.getAllBookings();

      expect(result.success).toBe(true);
      expect(result.data.bookings).toEqual(mockBookings);
      expect(result.data.count).toBe(2);
      expect(result.data.hasMore).toBe(false);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [50, 0]
      );
    });

    it('should filter bookings by status', async () => {
      const mockBookings = [{ id: 1, name: 'John Doe', status: 'confirmed' }];

      mockQuery.mockResolvedValue([mockBookings]);

      const result = await BookingService.getAllBookings({
        status: 'confirmed',
      });

      expect(result.success).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        ['confirmed', 50, 0]
      );
    });

    it('should handle custom pagination', async () => {
      const mockBookings = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        status: 'pending',
      }));

      mockQuery.mockResolvedValue([mockBookings]);

      const result = await BookingService.getAllBookings({
        limit: 10,
        offset: 20,
      });

      expect(result.success).toBe(true);
      expect(result.data.hasMore).toBe(true); // 10 results = limit, so hasMore
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [10, 20]
      );
    });

    it('should throw error on database failure', async () => {
      const dbError = new Error('Database connection failed');
      mockQuery.mockRejectedValue(dbError);

      await expect(BookingService.getAllBookings()).rejects.toThrow(
        'Database error while fetching bookings'
      );
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch bookings', dbError);
    });
  });

  describe('getBookingById', () => {
    it('should return booking when found', async () => {
      const mockBooking = { id: 1, name: 'John Doe', status: 'pending' };
      mockQuery.mockResolvedValue([[mockBooking]]);

      const result = await BookingService.getBookingById(1);

      expect(result.success).toBe(true);
      expect(result.data.booking).toEqual(mockBooking);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM bookings WHERE id = ?', [1]);
    });

    it('should return 404 when booking not found', async () => {
      mockQuery.mockResolvedValue([[]]);

      const result = await BookingService.getBookingById(999);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Booking not found');
      expect(result.error.status).toBe(404);
    });

    it('should throw error on database failure', async () => {
      const dbError = new Error('Connection lost');
      mockQuery.mockRejectedValue(dbError);

      await expect(BookingService.getBookingById(1)).rejects.toThrow(
        'Database error while fetching booking'
      );
    });
  });

  describe('createBooking', () => {
    const validBookingData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      preferredDate: '2025-12-15T10:00:00Z',
      participants: 2,
      bookingType: 'dive',
      courseId: null,
      diveSiteId: 'reef-dive-1',
      specialRequests: 'Vegetarian meals',
    };

    beforeEach(async () => {
      // Mock validation success by default
      const { validateBookingBusinessRules } = await import('../../services/validation.js');
      validateBookingBusinessRules.mockReturnValue({ isValid: true });
    });

    it('should create booking successfully with available slots', async () => {
      // Mock availability check
      const mockAvailability = [
        {
          date: '2025-12-15',
          available_slots: 10,
          booked_slots: 3,
        },
      ];

      // Mock database responses
      mockConnection.query
        .mockResolvedValueOnce([mockAvailability]) // availability check
        .mockResolvedValueOnce([{ insertId: 123 }]) // booking insert
        .mockResolvedValueOnce([{}]) // availability update
        .mockResolvedValueOnce([{}]); // history insert

      const result = await BookingService.createBooking(validBookingData);

      expect(result.success).toBe(true);
      expect(result.data.bookingId).toBe(123);
      expect(result.data.status).toBe('pending');
      expect(result.data.availableSlots).toBe(5); // 7 available - 2 requested
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should fail validation with business rule errors', async () => {
      const { validateBookingBusinessRules } = await import('../../services/validation.js');
      validateBookingBusinessRules.mockReturnValue({
        isValid: false,
        errors: [{ field: 'preferredDate', message: 'Date is in the past' }],
      });

      const result = await BookingService.createBooking(validBookingData);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Business rule validation failed');
      expect(result.error.details).toEqual([
        { field: 'preferredDate', message: 'Date is in the past' },
      ]);
      expect(pool.getConnection).not.toHaveBeenCalled();
    });

    it('should fail when date has no availability', async () => {
      mockConnection.query.mockResolvedValueOnce([[]]); // no availability records (proper MySQL format)

      const result = await BookingService.createBooking(validBookingData);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Date not available for booking');
      expect(result.error.status).toBe(400);
      expect(mockConnection.rollback).toHaveBeenCalled();
    });

    it('should fail when insufficient slots available', async () => {
      const mockAvailability = [
        {
          date: '2025-12-15',
          available_slots: 5,
          booked_slots: 4, // Only 1 slot available
        },
      ];

      mockConnection.query.mockResolvedValueOnce([mockAvailability]);

      const bookingData = { ...validBookingData, participants: 3 }; // Requesting 3 slots
      const result = await BookingService.createBooking(bookingData);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Not enough slots available');
      expect(result.error.status).toBe(409);
      expect(result.error.metadata.available).toBe(1);
      expect(result.error.metadata.requested).toBe(3);
      expect(mockConnection.rollback).toHaveBeenCalled();
    });

    it('should handle database errors during transaction', async () => {
      const mockAvailability = [
        {
          date: '2025-12-15',
          available_slots: 10,
          booked_slots: 3,
        },
      ];

      mockConnection.query
        .mockResolvedValueOnce([mockAvailability])
        .mockRejectedValueOnce(new Error('Insert failed'));

      await expect(BookingService.createBooking(validBookingData)).rejects.toThrow('Insert failed');
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateBookingStatus', () => {
    const mockBooking = {
      id: 1,
      status: 'pending',
      participants: 2,
      preferred_date: '2025-12-15',
    };

    it('should update status successfully', async () => {
      mockConnection.query
        .mockResolvedValueOnce([[mockBooking]]) // get booking
        .mockResolvedValueOnce([{}]) // update status
        .mockResolvedValueOnce([{}]); // history insert

      const result = await BookingService.updateBookingStatus(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(result.data.oldStatus).toBe('pending');
      expect(result.data.newStatus).toBe('confirmed');
      expect(mockConnection.commit).toHaveBeenCalled();
    });

    it('should handle cancellation and free slots', async () => {
      mockConnection.query
        .mockResolvedValueOnce([[mockBooking]]) // get booking
        .mockResolvedValueOnce([{}]) // update status
        .mockResolvedValueOnce([{}]) // update availability
        .mockResolvedValueOnce([{}]); // history insert

      const result = await BookingService.updateBookingStatus(1, 'cancelled');

      expect(result.success).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith(
        'UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?',
        [2, '2025-12-15']
      );
    });

    it('should handle un-cancellation and re-book slots', async () => {
      const cancelledBooking = { ...mockBooking, status: 'cancelled' };

      mockConnection.query
        .mockResolvedValueOnce([[cancelledBooking]]) // get booking
        .mockResolvedValueOnce([{}]) // update status
        .mockResolvedValueOnce([{}]) // update availability
        .mockResolvedValueOnce([{}]); // history insert

      const result = await BookingService.updateBookingStatus(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith(
        'UPDATE availability SET booked_slots = booked_slots + ? WHERE date = ?',
        [2, '2025-12-15']
      );
    });

    it('should return success when status already matches', async () => {
      const confirmedBooking = { ...mockBooking, status: 'confirmed' };

      mockConnection.query.mockResolvedValueOnce([[confirmedBooking]]);

      const result = await BookingService.updateBookingStatus(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(result.data.message).toBe('Status already up to date');
      expect(mockConnection.rollback).toHaveBeenCalled();
    });

    it('should return 404 for non-existent booking', async () => {
      mockConnection.query.mockResolvedValueOnce([[]]); // no booking found (proper MySQL format)

      const result = await BookingService.updateBookingStatus(999, 'confirmed');

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Booking not found');
      expect(result.error.status).toBe(404);
    });
  });

  describe('deleteBooking', () => {
    const mockBooking = {
      id: 1,
      status: 'confirmed',
      participants: 3,
      preferred_date: '2025-12-15',
    };

    it('should delete booking and free slots', async () => {
      mockConnection.query
        .mockResolvedValueOnce([[mockBooking]]) // get booking
        .mockResolvedValueOnce([{}]) // update availability
        .mockResolvedValueOnce([{}]); // delete booking

      const result = await BookingService.deleteBooking(1);

      expect(result.success).toBe(true);
      expect(result.data.bookingId).toBe(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        'UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?',
        [3, '2025-12-15']
      );
      expect(mockConnection.commit).toHaveBeenCalled();
    });

    it('should delete cancelled booking without freeing slots', async () => {
      const cancelledBooking = { ...mockBooking, status: 'cancelled' };

      mockConnection.query
        .mockResolvedValueOnce([[cancelledBooking]]) // get booking
        .mockResolvedValueOnce([{}]); // delete booking (no availability update)

      const result = await BookingService.deleteBooking(1);

      expect(result.success).toBe(true);
      // Should not call availability update for cancelled bookings
      expect(mockConnection.query).toHaveBeenCalledTimes(2);
    });

    it('should return 404 for non-existent booking', async () => {
      mockConnection.query.mockResolvedValueOnce([[]]); // no booking found (proper MySQL format)

      const result = await BookingService.deleteBooking(999);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Booking not found');
      expect(result.error.status).toBe(404);
    });

    it('should handle database errors during deletion', async () => {
      mockConnection.query
        .mockResolvedValueOnce([[mockBooking]])
        .mockRejectedValueOnce(new Error('Delete failed'));

      await expect(BookingService.deleteBooking(1)).rejects.toThrow('Delete failed');
      expect(mockConnection.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Database Transaction Handling', () => {
    it('should always release connection even on error', async () => {
      // Mock validation to pass first, then database error
      const { validateBookingBusinessRules } = await import('../../services/validation.js');
      validateBookingBusinessRules.mockReturnValue({ isValid: true });

      mockConnection.query.mockRejectedValue(new Error('Database error'));

      await expect(
        BookingService.createBooking({
          name: 'Test',
          email: 'test@test.com',
          phone: '12345678',
          preferredDate: '2025-12-15',
          participants: 1,
          bookingType: 'dive',
        })
      ).rejects.toThrow();

      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should rollback transaction on validation failure', async () => {
      const { validateBookingBusinessRules } = await import('../../services/validation.js');
      validateBookingBusinessRules.mockReturnValue({
        isValid: false,
        errors: [],
      });

      const result = await BookingService.createBooking({});

      expect(result.success).toBe(false);
      expect(pool.getConnection).not.toHaveBeenCalled();
    });
  });

  describe('Logging Integration', () => {
    it('should log database operations', async () => {
      mockQuery.mockResolvedValue([[]]);

      await BookingService.getAllBookings({ status: 'pending' });

      expect(logger.logDatabase).toHaveBeenCalledWith(
        'SELECT',
        'bookings',
        expect.objectContaining({ filters: { status: 'pending' } })
      );
    });

    it('should log successful operations', async () => {
      const mockAvailability = [
        {
          date: '2025-12-15',
          available_slots: 10,
          booked_slots: 3,
        },
      ];

      mockConnection.query
        .mockResolvedValueOnce([mockAvailability])
        .mockResolvedValueOnce([{ insertId: 123 }])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}]);

      const { validateBookingBusinessRules } = await import('../../services/validation.js');
      validateBookingBusinessRules.mockReturnValue({ isValid: true });

      await BookingService.createBooking({
        name: 'Test User',
        email: 'test@test.com',
        phone: '12345678',
        preferredDate: '2025-12-15T10:00:00Z',
        participants: 2,
        bookingType: 'dive',
      });

      expect(logger.info).toHaveBeenCalledWith(
        'Booking created successfully',
        expect.objectContaining({ bookingId: 123, participants: 2 })
      );
    });
  });
});
