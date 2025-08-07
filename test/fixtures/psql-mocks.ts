import type {TunnelConfig} from '../../src/types/pg/tunnel.js'
import type {PsqlConfigs} from '../../src/utils/pg/bastion.js'

// PsqlConfigs for default attachment (essential plan, no tunnel required)
export const defaultPsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGAPPNAME: 'psql non-interactive',
    PGDATABASE: 'db1',
    PGHOST: 'main-database.example.com',
    PGPASSWORD: 'password1',
    PGPORT: '5432',
    PGSSLMODE: 'require',
    PGUSER: 'user1',
  },
  dbTunnelConfig: {
    dstHost: 'main-database.example.com',
    dstPort: 5432,
    host: undefined, // No bastion host for essential plan
    localHost: '127.0.0.1',
    localPort: 49_152, // Example port, would be random in real usage
    privateKey: undefined, // No bastion key for essential plan
    username: 'bastion',
  } as TunnelConfig,
}

// PsqlConfigs for shield database attachment (shield plan, requires tunnel)
// Note: When tunnel is required, PGHOST and PGPORT are adjusted to use tunnel
export const shieldDatabasePsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGAPPNAME: 'psql non-interactive',
    PGDATABASE: 'db1',
    PGHOST: '127.0.0.1', // Adjusted to tunnel local host
    PGPASSWORD: 'password7',
    PGPORT: '49_153', // Adjusted to tunnel local port (example port)
    PGSSLMODE: 'require',
    PGUSER: 'user7',
  },
  dbTunnelConfig: {
    dstHost: 'shield-database.example.com',
    dstPort: 5432,
    host: '10.7.0.1',
    localHost: '127.0.0.1',
    localPort: 49_153, // Example port, would be random in real usage
    privateKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
    username: 'bastion',
  } as TunnelConfig,
}

// PsqlConfigs for private database attachment (private plan, requires tunnel)
// Note: For private plans, bastion config would be fetched from Data API
export const privateDatabasePsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGAPPNAME: 'psql non-interactive',
    PGDATABASE: 'db1',
    PGHOST: '127.0.0.1', // Adjusted to tunnel local host
    PGPASSWORD: 'password8',
    PGPORT: '49_154', // Adjusted to tunnel local port (example port)
    PGSSLMODE: 'require',
    PGUSER: 'user8',
  },
  dbTunnelConfig: {
    dstHost: 'private-database.example.com',
    dstPort: 5432,
    host: '10.7.0.2', // Example bastion host from Data API
    localHost: '127.0.0.1',
    localPort: 49_154, // Example port, would be random in real usage
    privateKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----', // From Data API
    username: 'bastion',
  } as TunnelConfig,
}
