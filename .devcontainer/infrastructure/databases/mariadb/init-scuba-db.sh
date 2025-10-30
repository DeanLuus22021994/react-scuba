#!/bin/bash
# ==============================================================================
# MariaDB Init Script - Create Scuba Booking Database
# ==============================================================================
# Purpose: Automatically create scuba_booking_db on container initialization
# Location: .devcontainer/infrastructure/databases/mariadb/
# ==============================================================================

set -euo pipefail

echo "=================================================="
echo "Initializing Scuba Booking Database"
echo "=================================================="

# Create the database if it doesn't exist
mysql -u root -p"${MARIADB_ROOT_PASSWORD}" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS scuba_booking_db;
    GRANT ALL PRIVILEGES ON scuba_booking_db.* TO 'root'@'%';
    GRANT ALL PRIVILEGES ON scuba_booking_db.* TO '${MARIADB_USER}'@'%';
    FLUSH PRIVILEGES;

    SELECT 'Database scuba_booking_db created successfully' AS Status;
EOSQL

echo "=================================================="
echo "Scuba Booking Database initialization complete"
echo "=================================================="
