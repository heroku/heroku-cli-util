import type {PsqlConfigs} from '../../src/utils/pg/bastion.js'
import type {TunnelConfig} from '../../src/types/pg/tunnel.js'

// PsqlConfigs for default attachment (essential plan, no tunnel required)
export const defaultPsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGDATABASE: 'db1',
    PGHOST: 'main-database.example.com',
    PGPASSWORD: 'password1',
    PGPORT: '5432',
    PGUSER: 'user1',
    PGAPPNAME: 'psql non-interactive',
    PGSSLMODE: 'require',
  },
  dbTunnelConfig: {
    dstHost: 'main-database.example.com',
    dstPort: 5432,
    host: undefined, // No bastion host for essential plan
    localHost: '127.0.0.1',
    localPort: 49152, // Example port, would be random in real usage
    privateKey: undefined, // No bastion key for essential plan
    username: 'bastion',
  } as TunnelConfig,
}

// PsqlConfigs for shield database attachment (shield plan, requires tunnel)
// Note: When tunnel is required, PGHOST and PGPORT are adjusted to use tunnel
export const shieldDatabasePsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGDATABASE: 'db1',
    PGHOST: '127.0.0.1', // Adjusted to tunnel local host
    PGPASSWORD: 'password7',
    PGPORT: '49153', // Adjusted to tunnel local port (example port)
    PGUSER: 'user7',
    PGAPPNAME: 'psql non-interactive',
    PGSSLMODE: 'require',
  },
  dbTunnelConfig: {
    dstHost: 'shield-database.example.com',
    dstPort: 5432,
    host: '10.7.0.1',
    localHost: '127.0.0.1',
    localPort: 49153, // Example port, would be random in real usage
    privateKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
    username: 'bastion',
  } as TunnelConfig,
}

// PsqlConfigs for private database attachment (private plan, requires tunnel)
// Note: For private plans, bastion config would be fetched from Data API
export const privateDatabasePsqlConfigs: PsqlConfigs = {
  dbEnv: {
    PGDATABASE: 'db1',
    PGHOST: '127.0.0.1', // Adjusted to tunnel local host
    PGPASSWORD: 'password8',
    PGPORT: '49154', // Adjusted to tunnel local port (example port)
    PGUSER: 'user8',
    PGAPPNAME: 'psql non-interactive',
    PGSSLMODE: 'require',
  },
  dbTunnelConfig: {
    dstHost: 'private-database.example.com',
    dstPort: 5432,
    host: '10.7.0.2', // Example bastion host from Data API
    localHost: '127.0.0.1',
    localPort: 49154, // Example port, would be random in real usage
    privateKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----', // From Data API
    username: 'bastion',
  } as TunnelConfig,
} 