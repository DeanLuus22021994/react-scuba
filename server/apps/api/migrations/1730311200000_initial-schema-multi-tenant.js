/* eslint-disable camelcase */

/**
 * Initial schema setup for multi-tenant React Scuba platform
 *
 * Creates schema-based multi-tenancy structure:
 * - Separate schema per tenant for data isolation
 * - Shared schema for common reference data
 * - Tenant registry table for dynamic tenant discovery
 */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create shared schema for reference data
  pgm.createSchema('shared', { ifNotExists: true });

  // Tenant registry table
  pgm.createTable({ schema: 'shared', name: 'tenants' }, {
    id: { type: 'serial', primaryKey: true },
    slug: { type: 'varchar(100)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    schema_name: { type: 'varchar(100)', notNull: true, unique: true },
    domain: { type: 'varchar(255)' },
    subdomain: { type: 'varchar(100)' },
    is_active: { type: 'boolean', notNull: true, default: true },
    settings: { type: 'jsonb', notNull: true, default: '{}' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index on subdomain/domain for fast tenant resolution
  pgm.createIndex({ schema: 'shared', name: 'tenants' }, 'subdomain');
  pgm.createIndex({ schema: 'shared', name: 'tenants' }, 'domain');
  pgm.createIndex({ schema: 'shared', name: 'tenants' }, 'schema_name');

  // Function to create tenant schema with base tables
  pgm.createFunction(
    { schema: 'shared', name: 'create_tenant_schema' },
    [{ name: 'tenant_schema', type: 'varchar' }],
    { returns: 'void', language: 'plpgsql', replace: true },
    `
    BEGIN
      EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', tenant_schema);

      -- Users table
      EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      ', tenant_schema);

      -- Bookings table
      EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES %I.users(id),
          dive_site VARCHAR(255) NOT NULL,
          dive_date DATE NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT ''pending'',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      ', tenant_schema, tenant_schema);

      -- Certifications table
      EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I.certifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES %I.users(id),
          certification_type VARCHAR(100) NOT NULL,
          certification_number VARCHAR(100) NOT NULL,
          issue_date DATE NOT NULL,
          expiry_date DATE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      ', tenant_schema, tenant_schema);

    END;
    `
  );

  // Create initial tenant schemas
  pgm.sql(`
    INSERT INTO shared.tenants (slug, name, schema_name, subdomain, domain)
    VALUES
      ('di-authority-johannesburg', 'DI Authority Johannesburg', 'tenant_di_authority_johannesburg', 'di-authority-johannesburg', 'di-authority-johannesburg.react-scuba.com'),
      ('ocean-spirit-mauritius', 'Ocean Spirit Mauritius', 'tenant_ocean_spirit_mauritius', 'ocean-spirit-mauritius', 'ocean-spirit-mauritius.react-scuba.com')
    ON CONFLICT (slug) DO NOTHING;
  `);

  // Create tenant schemas
  pgm.sql(`SELECT shared.create_tenant_schema('tenant_di_authority_johannesburg')`);
  pgm.sql(`SELECT shared.create_tenant_schema('tenant_ocean_spirit_mauritius')`);

  // Shared reference tables
  pgm.createTable({ schema: 'shared', name: 'dive_sites' }, {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    latitude: { type: 'decimal(10,8)' },
    longitude: { type: 'decimal(11,8)' },
    max_depth: { type: 'integer' },
    description: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable({ schema: 'shared', name: 'certification_types' }, {
    id: { type: 'serial', primaryKey: true },
    code: { type: 'varchar(50)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    level: { type: 'integer', notNull: true },
    description: { type: 'text' },
  });

  // Insert reference data
  pgm.sql(`
    INSERT INTO shared.certification_types (code, name, level, description)
    VALUES
      ('OWD', 'Open Water Diver', 1, 'Entry-level recreational diving certification'),
      ('AOW', 'Advanced Open Water', 2, 'Advanced recreational diving certification'),
      ('RESCUE', 'Rescue Diver', 3, 'Emergency response and rescue techniques'),
      ('DM', 'Divemaster', 4, 'Professional-level diving certification'),
      ('INSTRUCTOR', 'Instructor', 5, 'Teaching certification')
    ON CONFLICT (code) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  // Drop tenant schemas
  pgm.dropSchema('tenant_ocean_spirit_mauritius', { cascade: true, ifExists: true });
  pgm.dropSchema('tenant_di_authority_johannesburg', { cascade: true, ifExists: true });

  // Drop shared function and tables
  pgm.dropFunction({ schema: 'shared', name: 'create_tenant_schema' }, [{ name: 'tenant_schema', type: 'varchar' }], { ifExists: true });
  pgm.dropTable({ schema: 'shared', name: 'certification_types' }, { ifExists: true });
  pgm.dropTable({ schema: 'shared', name: 'dive_sites' }, { ifExists: true });
  pgm.dropTable({ schema: 'shared', name: 'tenants' }, { ifExists: true });

  // Drop shared schema
  pgm.dropSchema('shared', { cascade: true, ifExists: true });
};
