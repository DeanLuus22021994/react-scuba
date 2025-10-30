#!/bin/bash
# ==============================================================================
# MariaDB Exporter User Initialization Script
# ==============================================================================
# Purpose: Process SQL template and create monitoring user with environment password
# Location: .devcontainer/infrastructure/databases/mariadb/
# Usage: Automatically executed by docker-entrypoint-initdb.d
# ==============================================================================

set -e

# Replace placeholder with actual password from environment
sed "s/EXPORTER_PASSWORD_PLACEHOLDER/${DOCKER_MARIADB_ROOT_PASSWORD}/g" \
  /docker-entrypoint-initdb.d/init-exporter-user.sql.template \
  > /tmp/init-exporter-user.sql

# Execute the processed SQL (MariaDB 11 uses 'mariadb' command)
mariadb -u root -p"${MARIADB_ROOT_PASSWORD}" < /tmp/init-exporter-user.sql

# Cleanup
rm /tmp/init-exporter-user.sql

echo "MariaDB exporter user initialized with environment credentials"
