/**
 * Structured logging utility for API server
 * Provides consistent logging format with metadata support
 */

const LOG_LEVELS = {
	ERROR: "ERROR",
	WARN: "WARN",
	INFO: "INFO",
	DEBUG: "DEBUG",
};

class Logger {
	constructor() {
		this.isDevelopment = process.env.NODE_ENV !== "production";
	}

	/**
	 * Format log entry with timestamp and metadata
	 * @param {string} level - Log level
	 * @param {string} message - Log message
	 * @param {object} meta - Additional metadata
	 * @returns {object} Formatted log entry
	 */
	formatLog(level, message, meta = {}) {
		return {
			timestamp: new Date().toISOString(),
			level,
			message,
			pid: process.pid,
			service: "react-scuba-api",
			...meta,
		};
	}

	/**
	 * Log error messages
	 * @param {string} message - Error message
	 * @param {object} error - Error object or metadata
	 */
	error(message, error = {}) {
		const meta =
			error instanceof Error
				? {
						error: {
							name: error.name,
							message: error.message,
							stack: error.stack,
						},
					}
				: { meta: error };

		console.error(
			JSON.stringify(this.formatLog(LOG_LEVELS.ERROR, message, meta)),
		);
	}

	/**
	 * Log warning messages
	 * @param {string} message - Warning message
	 * @param {object} meta - Additional metadata
	 */
	warn(message, meta = {}) {
		console.warn(
			JSON.stringify(this.formatLog(LOG_LEVELS.WARN, message, meta)),
		);
	}

	/**
	 * Log info messages
	 * @param {string} message - Info message
	 * @param {object} meta - Additional metadata
	 */
	info(message, meta = {}) {
		console.log(JSON.stringify(this.formatLog(LOG_LEVELS.INFO, message, meta)));
	}

	/**
	 * Log debug messages (only in development)
	 * @param {string} message - Debug message
	 * @param {object} meta - Additional metadata
	 */
	debug(message, meta = {}) {
		if (this.isDevelopment) {
			console.log(
				JSON.stringify(this.formatLog(LOG_LEVELS.DEBUG, message, meta)),
			);
		}
	}

	/**
	 * Log HTTP requests
	 * @param {object} req - Express request object
	 * @param {object} res - Express response object
	 * @param {number} duration - Request duration in ms
	 */
	logRequest(req, res, duration) {
		this.info("HTTP Request", {
			method: req.method,
			url: req.url,
			userAgent: req.get("User-Agent"),
			ip: req.ip,
			status: res.statusCode,
			duration: `${duration}ms`,
			requestId: req.id || "unknown",
		});
	}

	/**
	 * Log database operations
	 * @param {string} operation - Database operation type
	 * @param {string} table - Database table name
	 * @param {object} meta - Additional metadata
	 */
	logDatabase(operation, table, meta = {}) {
		this.debug("Database Operation", {
			operation,
			table,
			...meta,
		});
	}
}

// Export singleton instance
export const logger = new Logger();
export default logger;
