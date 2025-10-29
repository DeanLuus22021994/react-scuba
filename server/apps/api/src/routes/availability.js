import express from "express";
import { query } from "express-validator";
import pool from "../db/connection.js";
import logger from "../utils/logger.js";

const router = express.Router();

// GET availability for a date range
router.get(
	"/",
	query("startDate").isISO8601().toDate(),
	query("endDate").isISO8601().toDate(),
	async (req, res) => {
		try {
			const { startDate, endDate } = req.query;

			const [availability] = await pool.query(
				"SELECT date, total_slots, booked_slots, available_slots FROM availability WHERE date BETWEEN ? AND ? ORDER BY date",
				[startDate, endDate],
			);

			res.json({ availability });
		} catch (error) {
			logger.error("Error fetching availability", { error: error.message });
			res.status(500).json({ error: "Failed to fetch availability" });
		}
	},
);

// GET availability for a specific date
router.get("/date/:date", async (req, res) => {
	try {
		const { date } = req.params;

		const [availability] = await pool.query(
			"SELECT * FROM availability WHERE date = ?",
			[date],
		);

		if (availability.length === 0) {
			return res
				.status(404)
				.json({ error: "No availability data for this date" });
		}

		res.json({ availability: availability[0] });
	} catch (error) {
		logger.error("Error fetching availability", { error: error.message });
		res.status(500).json({ error: "Failed to fetch availability" });
	}
});

export default router;
