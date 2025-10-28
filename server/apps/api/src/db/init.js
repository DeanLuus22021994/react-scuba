import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config();

const createTables = async (dbPool) => {
  try {
    // Create bookings table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        preferred_date DATE NOT NULL,
        participants INT NOT NULL DEFAULT 1,
        booking_type VARCHAR(50) NOT NULL,
        course_id VARCHAR(50),
        dive_site_id VARCHAR(50),
        special_requests TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_date (preferred_date),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create availability calendar table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        total_slots INT NOT NULL DEFAULT 20,
        booked_slots INT NOT NULL DEFAULT 0,
        available_slots INT GENERATED ALWAYS AS (total_slots - booked_slots) STORED,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_available (available_slots)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create contacts table for contact form submissions
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create booking history/audit log
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS booking_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_status VARCHAR(50),
        new_status VARCHAR(50),
        changed_by VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        INDEX idx_booking (booking_id),
        INDEX idx_action (action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.error('✓ All database tables created successfully');
  } catch (error) {
    console.error('✗ Error creating tables:', error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    // Create connection WITHOUT database to create database
    const tempPool = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      connectionLimit: 1,
    });

    const connection = await tempPool.getConnection();
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'scuba_booking_db'} 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    connection.release();
    await tempPool.end();

    // Now connect WITH database and create tables
    const dbPool = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'scuba_booking_db',
      connectionLimit: 10,
    });

    await createTables(dbPool);

    // Initialize availability for next 90 days
    const existing = await dbPool.query('SELECT COUNT(*) as count FROM availability');
    if (existing[0].count === 0) {
      const values = [];
      for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const [dateStr] = date.toISOString().split('T');
        values.push(`('${dateStr}', 20, 0)`);
      }
      await dbPool.query(
        `INSERT INTO availability (date, total_slots, booked_slots) VALUES ${values.join(',')}`
      );
      console.error('✓ Initialized availability calendar for 90 days');
    }

    await dbPool.end();
    console.error('✓ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
