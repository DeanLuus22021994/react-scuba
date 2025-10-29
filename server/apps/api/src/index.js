import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import availabilityRoutes from "./routes/availability.js";
import bookingRoutes from "./routes/bookings.js";
import contactRoutes from "./routes/contacts.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'self'",
					"'unsafe-inline'",
					"https://www.googletagmanager.com",
				],
				styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
				fontSrc: ["'self'", "https://fonts.gstatic.com"],
				imgSrc: ["'self'", "data:", "https:"],
				connectSrc: ["'self'", "https://www.google-analytics.com"],
			},
		},
		crossOriginEmbedderPolicy: false,
	}),
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: {
		error: {
			message: "Too many requests from this IP, please try again later.",
			status: 429,
			retryAfter: 900, // 15 minutes in seconds
		},
	},
	standardHeaders: true, // Return rate limit info in headers
	legacyHeaders: false, // Disable X-RateLimit-* headers
	handler: (req, res) => {
		res.status(429).json({
			error: {
				message: "Too many requests from this IP, please try again later.",
				status: 429,
				retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
			},
		});
	},
});
app.use("/api/", limiter);

// CORS configuration
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:3001",
		credentials: true,
	}),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (liveness probe)
app.get("/health", (req, res, next) => {
	try {
		res.json({ status: "healthy", timestamp: new Date().toISOString() });
	} catch (error) {
		logger.error("Health check failed", error);
		next(error);
	}
});

// Readiness endpoint (checks if service is ready to accept traffic)
app.get("/ready", (req, res, next) => {
	try {
		// Check if server is running and can handle requests
		const readinessData = {
			status: "ready",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memory: {
				heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
				heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
				external: Math.round(process.memoryUsage().external / 1024 / 1024),
				rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
			},
		};
		res.json(readinessData);
	} catch (error) {
		logger.error("Readiness check failed", error);
		res.status(503).json({ status: "not_ready", error: error.message });
	}
});

// Metrics endpoint (basic prometheus-compatible metrics)
app.get("/metrics", (req, res) => {
	try {
		const uptime = process.uptime();
		const memory = process.memoryUsage();
		const metrics = `# HELP nodejs_uptime_seconds Uptime in seconds
# TYPE nodejs_uptime_seconds gauge
nodejs_uptime_seconds ${uptime}

# HELP nodejs_process_memory_bytes Process memory usage in bytes
# TYPE nodejs_process_memory_bytes gauge
nodejs_process_memory_heap_used_bytes ${memory.heapUsed}
nodejs_process_memory_heap_total_bytes ${memory.heapTotal}
nodejs_process_memory_external_bytes ${memory.external}
nodejs_process_memory_rss_bytes ${memory.rss}

# HELP nodejs_gc_duration_seconds GC duration
# TYPE nodejs_gc_duration_seconds counter
nodejs_requests_total{method="GET",path="/health"} 1

# HELP api_server_info API server information
# TYPE api_server_info gauge
api_server_info{version="0.1.0",node="${process.version}"} 1
`;
		res.set("Content-Type", "text/plain");
		res.send(metrics);
	} catch (error) {
		logger.error("Metrics endpoint error", error);
		res.status(500).send("Error generating metrics");
	}
});

// API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/availability", availabilityRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
	logger.error("API Error", {
		error: err,
		method: req.method,
		url: req.url,
		ip: req.ip,
		userAgent: req.get("User-Agent"),
	});

	// Don't leak error details in production
	const isDevelopment = process.env.NODE_ENV !== "production";
	res.status(err.status || 500).json({
		error: {
			message: err.message || "Internal server error",
			status: err.status || 500,
			...(isDevelopment && { stack: err.stack }),
		},
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		error: {
			message: "Route not found",
			status: 404,
		},
	});
});

app.listen(PORT, () => {
	logger.info("Server started", {
		port: PORT,
		environment: process.env.NODE_ENV,
	});
});

// Graceful shutdown handling (for Docker/Kubernetes)
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
	if (isShuttingDown) return;
	isShuttingDown = true;

	logger.info(`Received ${signal} signal - starting graceful shutdown`);

	// Mark as not ready for new requests
	app.get("/ready", (req, res) => {
		res.status(503).json({ status: "shutting_down" });
	});

	// Give container orchestrator time to stop sending traffic
	setTimeout(() => {
		logger.info("Graceful shutdown timeout exceeded - force exiting");
		process.exit(0);
	}, 30000); // 30 second timeout
};

// Handle termination signals from Docker/Kubernetes
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Promise Rejection", {
		reason,
		promise: promise.toString(),
		location: "process.unhandledRejection",
	});
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception - Server will exit", error);
	process.exit(1);
});

export default app;
