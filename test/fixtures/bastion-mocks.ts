import type {ConnectionDetailsWithAttachment} from '../../src/types/pg/tunnel.js'

import {defaultAttachment, privateDatabaseAttachment, shieldDatabaseAttachment} from './attachment-mocks.js'

// Connection details for default attachment (essential plan, no tunnel required)
export const defaultConnectionDetails: ConnectionDetailsWithAttachment = {
  attachment: defaultAttachment,
  database: 'db1',
  host: 'main-database.example.com',
  password: 'password1',
  pathname: '/db1',
  port: '5432',
  url: 'postgres://user1:password1@main-database.example.com:5432/db1',
  user: 'user1',
}

// Connection details for shield database attachment (shield plan, requires tunnel)
export const shieldDatabaseConnectionDetails: ConnectionDetailsWithAttachment = {
  attachment: shieldDatabaseAttachment,
  bastionHost: '10.7.0.1',
  bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
  database: 'db1',
  host: 'shield-database.example.com',
  password: 'password7',
  pathname: '/db1',
  port: '5432',
  url: 'postgres://user7:password7@shield-database.example.com:5432/db1',
  user: 'user7',
}

// Connection details for private database attachment (private plan, requires tunnel)
export const privateDatabaseConnectionDetails: ConnectionDetailsWithAttachment = {
  attachment: privateDatabaseAttachment,
  bastionHost: '10.7.0.2',
  bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
  database: 'db1',
  host: 'private-database.example.com',
  password: 'password8',
  pathname: '/db1',
  port: '5432',
  url: 'postgres://user8:password8@private-database.example.com:5432/db1',
  user: 'user8',
}
