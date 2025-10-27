# DevContainer Configuration Directory

## Overview

Centralized configuration files shared across MCP cluster services. Single source of truth for database schemas, service configurations, and initialization scripts.

## Structure

```
config/
├── README.md              # This file
├── init.sql              # PostgreSQL initialization schema
├── my.cnf                # MariaDB server configuration
├── icon.svg              # DevContainer icon asset
└── supervisord.conf      # Process management (if needed)
```

## Database Configurations

### PostgreSQL (init.sql)

- **Purpose**: Initialize PostgreSQL schema on first startup
- **Location**: Mounted to `/docker-entrypoint-initdb.d/` in postgres-db container
- **Execution**: Automatic on empty data volume
- **Schema**: Creates `mcp_db` database with extensions (pgcrypto, uuid-ossp)

### MariaDB (my.cnf)

- **Purpose**: Optimize MariaDB for development workloads
- **Location**: Mounted to `/etc/mysql/conf.d/` in mariadb container
- **Key Settings**:
  - `max_connections = 200` - High concurrency support
  - `innodb_buffer_pool_size = 256M` - Memory optimization
  - `character_set_server = utf8mb4` - Full Unicode support
  - `slow_query_log = 1` - Performance monitoring

## Usage

### Modifying Database Schemas

```bash
# Edit init.sql, then recreate database
docker-compose -f docker-compose.mcp.yml down -v postgres-db
docker-compose -f docker-compose.mcp.yml up -d postgres-db
```

### Applying MariaDB Configuration Changes

```bash
# Edit my.cnf, then restart service
docker-compose -f docker-compose.mcp.yml restart mariadb
```

### Validation

```bash
# Verify PostgreSQL schema
docker exec -it postgres-db psql -U postgres -c "\l"

# Verify MariaDB configuration
docker exec -it mariadb mysql -u root -ppassword -e "SHOW VARIABLES LIKE '%char%';"
```

## Best Practices

- ✅ Keep init scripts idempotent (use `IF NOT EXISTS`)
- ✅ Version control all configuration changes
- ✅ Test configuration changes in isolated environment first
- ✅ Document non-standard settings with inline comments
- ⚠️ Avoid storing secrets in configuration files (use environment variables)

## Performance Tuning

### PostgreSQL

- Adjust `shared_buffers` in `docker-compose.mcp.yml` for memory optimization
- Use `EXPLAIN ANALYZE` for query optimization
- Monitor with postgres-exporter metrics at http://localhost:9187/metrics

### MariaDB

- Tune `innodb_buffer_pool_size` based on available RAM
- Use `slow_query_log` to identify bottlenecks
- Monitor with mysql-exporter metrics at http://localhost:9104/metrics

## Troubleshooting

### Schema Not Applied

```bash
# Check if volume was empty during initialization
docker volume inspect mcp-cluster_postgres-data
# If not empty, must recreate: docker-compose down -v
```

### Configuration Ignored

```bash
# Verify mount path
docker inspect postgres-db --format '{{json .Mounts}}' | jq
# Confirm file syntax
docker exec -it mariadb my_print_defaults --mysqld
```

## References

- PostgreSQL Docker Hub: https://hub.docker.com/_/postgres
- MariaDB Configuration: https://mariadb.com/kb/en/server-system-variables/
- Docker Init Scripts: https://docs.docker.com/samples/postgres/
