import dotenv from "dotenv";
import mariadb from "mariadb";
import logger from "../utils/logger.js";

dotenv.config();

const pool = mariadb.createPool({
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "password",
	database: process.env.DB_NAME || "scuba_booking_db",
	connectionLimit: 10,
});

// Test connection on startup (non-blocking)
pool
	.getConnection()
	.then((connection) => {
		logger.info("Database connection established");
		connection.release();
	})
	.catch((err) => {
		logger.error("Database connection failed", { error: err.message });
		logger.warn("Server will continue but database operations will fail");
	});

export default pool;
