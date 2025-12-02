import {Server} from 'node:net'

import type {ExtendedAddonAttachment} from './platform-api.js'

export type ConnectionDetails = {
  _tunnel?: Server
  attachment?: ExtendedAddonAttachment
  database: string
  host: string
  password: string
  pathname: string
  port: string
  url: string
  user: string
} & BastionConfig

export interface TunnelConfig {
  dstHost: string
  dstPort: number
  host?: string
  localHost: string
  localPort: number
  privateKey?: string
  username: string
}

export interface BastionConfigResponse {
  host: string
  private_key: string
}

export type BastionConfig = {
  bastionHost?: string
  bastionKey?: string
}
