/**
 * Booking service - handles all booking business logic
 * Separated from routes to follow Single Responsibility Principle
 */
import pool from "../db/connection.js";
import logger from "../utils/logger.js";
import { validateBookingBusinessRules } from "./validation.js";

export class BookingService {
	/**
	 * Get all bookings with optional filtering
	 * @param {object} filters - Query filters
	 * @returns {Promise<object>} Bookings data and metadata
	 */
	static async getAllBookings(filters = {}) {
		const { status, limit = 50, offset = 0 } = filters;

		try {
			let queryStr = "SELECT * FROM bookings";
			const params = [];

			if (status) {
				queryStr += " WHERE status = ?";
				params.push(status);
			}

			queryStr += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
			params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));

			logger.logDatabase("SELECT", "bookings", { filters, queryStr });
			const [bookings] = await pool.query(queryStr, params);

			return {
				success: true,
				data: {
					bookings,
					count: bookings.length,
					hasMore: bookings.length === Number.parseInt(limit, 10),
				},
			};
		} catch (error) {
			logger.error("Failed to fetch bookings", error);
			throw new Error("Database error while fetching bookings");
		}
	}

	/**
	 * Get single booking by ID
	 * @param {string|number} id - Booking ID
	 * @returns {Promise<object>} Booking data
	 */
	static async getBookingById(id) {
		try {
			logger.logDatabase("SELECT", "bookings", { bookingId: id });
			const [bookings] = await pool.query(
				"SELECT * FROM bookings WHERE id = ?",
				[id],
			);

			if (bookings.length === 0) {
				return {
					success: false,
					error: { message: "Booking not found", status: 404 },
				};
			}

			return {
				success: true,
				data: { booking: bookings[0] },
			};
		} catch (error) {
			logger.error("Failed to fetch booking", { bookingId: id, error });
			throw new Error("Database error while fetching booking");
		}
	}

	/**
	 * Create new booking with availability checking
	 * @param {object} bookingData - Booking information
	 * @returns {Promise<object>} Creation result
	 */
	static async createBooking(bookingData) {
		// Validate business rules first
		const validation = validateBookingBusinessRules(bookingData);
		if (!validation.isValid) {
			return {
				success: false,
				error: {
					message: "Business rule validation failed",
					status: 400,
					details: validation.errors,
				},
			};
		}

		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();
			logger.debug("Started booking creation transaction", { bookingData });

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
			} = bookingData;

			// Check availability with row-level locking
			const [dateStr] = new Date(preferredDate).toISOString().split("T");
			const [availability] = await connection.query(
				"SELECT * FROM availability WHERE date = ? FOR UPDATE",
				[dateStr],
			);

			if (availability.length === 0) {
				await connection.rollback();
				return {
					success: false,
					error: {
						message: "Date not available for booking",
						status: 400,
						details: [
							{
								field: "preferredDate",
								message: "No availability slots for this date",
							},
						],
					},
				};
			}

			const [avail] = availability;
			const availableSlots = avail.available_slots - avail.booked_slots;

			if (availableSlots < participants) {
				await connection.rollback();
				return {
					success: false,
					error: {
						message: "Not enough slots available",
						status: 409,
						details: [
							{
								field: "participants",
								message: `Only ${availableSlots} slots available, but ${participants} requested`,
							},
						],
						metadata: { available: availableSlots, requested: participants },
					},
				};
			}

			// Create booking record
			logger.logDatabase("INSERT", "bookings", {
				name,
				email,
				bookingType,
				participants,
				preferredDate: dateStr,
			});

			const [result] = await connection.query(
				`INSERT INTO bookings (name, email, phone, preferred_date, participants, booking_type,
         course_id, dive_site_id, special_requests, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
				[
					name,
					email,
					phone,
					dateStr,
					participants,
					bookingType,
					courseId || null,
					diveSiteId || null,
					specialRequests || null,
				],
			);

			const bookingId = result.insertId;

			// Update availability slots
			await connection.query(
				"UPDATE availability SET booked_slots = booked_slots + ? WHERE date = ?",
				[participants, dateStr],
			);

			// Log booking history
			await connection.query(
				"INSERT INTO booking_history (booking_id, action, new_status, notes, created_at) VALUES (?, ?, ?, ?, NOW())",
				[bookingId, "created", "pending", "Booking created via API"],
			);

			await connection.commit();
			logger.info("Booking created successfully", {
				bookingId,
				participants,
				dateStr,
			});

			return {
				success: true,
				data: {
					message: "Booking created successfully",
					bookingId,
					availableSlots: availableSlots - participants,
					status: "pending",
				},
			};
		} catch (error) {
			await connection.rollback();
			logger.error("Failed to create booking", { bookingData, error });
			throw error;
		} finally {
			connection.release();
		}
	}

	/**
	 * Update booking status
	 * @param {string|number} id - Booking ID
	 * @param {string} newStatus - New status value
	 * @returns {Promise<object>} Update result
	 */
	static async updateBookingStatus(id, newStatus) {
		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();
			logger.debug("Started status update transaction", {
				bookingId: id,
				newStatus,
			});

			// Get current booking with lock
			const [bookings] = await connection.query(
				"SELECT * FROM bookings WHERE id = ? FOR UPDATE",
				[id],
			);

			if (bookings.length === 0) {
				await connection.rollback();
				return {
					success: false,
					error: { message: "Booking not found", status: 404 },
				};
			}

			const [booking] = bookings;
			const oldStatus = booking.status;

			// Prevent unnecessary updates
			if (oldStatus === newStatus) {
				await connection.rollback();
				return {
					success: true,
					data: {
						message: "Status already up to date",
						bookingId: id,
						status: newStatus,
					},
				};
			}

			// Update booking status
			await connection.query(
				"UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?",
				[newStatus, id],
			);

			// Handle slot availability changes
			if (newStatus === "cancelled" && oldStatus !== "cancelled") {
				// Free up slots when cancelling
				await connection.query(
					"UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?",
					[booking.participants, booking.preferred_date],
				);
				logger.debug("Freed booking slots", {
					participants: booking.participants,
					date: booking.preferred_date,
				});
			} else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
				// Re-book slots when un-cancelling
				await connection.query(
					"UPDATE availability SET booked_slots = booked_slots + ? WHERE date = ?",
					[booking.participants, booking.preferred_date],
				);
				logger.debug("Re-booked slots", {
					participants: booking.participants,
					date: booking.preferred_date,
				});
			}

			// Log history
			await connection.query(
				"INSERT INTO booking_history (booking_id, action, old_status, new_status, created_at) VALUES (?, ?, ?, ?, NOW())",
				[id, "status_changed", oldStatus, newStatus],
			);

			await connection.commit();
			logger.info("Booking status updated", {
				bookingId: id,
				oldStatus,
				newStatus,
			});

			return {
				success: true,
				data: {
					message: "Booking status updated successfully",
					bookingId: id,
					oldStatus,
					newStatus,
				},
			};
		} catch (error) {
			await connection.rollback();
			logger.error("Failed to update booking status", {
				bookingId: id,
				newStatus,
				error,
			});
			throw error;
		} finally {
			connection.release();
		}
	}

	/**
	 * Delete booking and free slots
	 * @param {string|number} id - Booking ID
	 * @returns {Promise<object>} Deletion result
	 */
	static async deleteBooking(id) {
		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();
			logger.debug("Started booking deletion transaction", { bookingId: id });

			// Get booking info with lock
			const [bookings] = await connection.query(
				"SELECT * FROM bookings WHERE id = ? FOR UPDATE",
				[id],
			);

			if (bookings.length === 0) {
				await connection.rollback();
				return {
					success: false,
					error: { message: "Booking not found", status: 404 },
				};
			}

			const [booking] = bookings;

			// Free up slots if booking wasn't already cancelled
			if (booking.status !== "cancelled") {
				await connection.query(
					"UPDATE availability SET booked_slots = booked_slots - ? WHERE date = ?",
					[booking.participants, booking.preferred_date],
				);
				logger.debug("Freed slots during deletion", {
					participants: booking.participants,
					date: booking.preferred_date,
				});
			}

			// Delete booking (should cascade to history via foreign key)
			await connection.query("DELETE FROM bookings WHERE id = ?", [id]);

			await connection.commit();
			logger.info("Booking deleted successfully", { bookingId: id });

			return {
				success: true,
				data: {
					message: "Booking deleted successfully",
					bookingId: id,
				},
			};
		} catch (error) {
			await connection.rollback();
			logger.error("Failed to delete booking", { bookingId: id, error });
			throw error;
		} finally {
			connection.release();
		}
	}
}
