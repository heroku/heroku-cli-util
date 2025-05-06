import {Server} from 'node:net'
import * as createTunnel from 'tunnel-ssh'

import type {AddOnAttachment} from '@heroku-cli/schema'

import type {AddOnAttachmentWithConfigVarsAndPlan} from './data-api'

export type ConnectionDetails = {
  _tunnel?: Server
  bastionHost?: string
  bastionKey?: string
  database: string
  host: string
  password: string
  pathname: string
  port: string
  url: string
  user: string
}

export type ConnectionDetailsWithAttachment = {
  attachment: Required<{addon: AddOnAttachmentWithConfigVarsAndPlan} & AddOnAttachment>
} & ConnectionDetails

export type TunnelConfig = createTunnel.Config
