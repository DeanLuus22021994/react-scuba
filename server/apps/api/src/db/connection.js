import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'scuba_booking_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection on startup (non-blocking)
pool
  .getConnection()
  .then((connection) => {
    console.error('✓ Database connection established');
    connection.release();
  })
  .catch((err) => {
    console.error('✗ Database connection failed:', err.message);
    console.error('Server will continue but database operations will fail');
  });

export default pool;
