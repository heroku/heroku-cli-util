import type {AddOnAttachment} from '@heroku-cli/schema'

import {Server} from 'node:net'
import * as createTunnel from 'tunnel-ssh'

import type {ExtendedAddonAttachment} from './data-api.js'

export type ConnectionDetails = {
  _tunnel?: Server
  database: string
  host: string
  password: string
  pathname: string
  port: string
  url: string
  user: string
} & BastionConfig

export type ConnectionDetailsWithAttachment = {
  attachment: ExtendedAddonAttachment
} & ConnectionDetails

export type TunnelConfig = createTunnel.Config

export interface BastionConfigResponse {
  host: string
  private_key: string
}

export type BastionConfig = {
  bastionHost?: string
  bastionKey?: string
}
