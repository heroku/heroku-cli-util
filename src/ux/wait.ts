import {ux} from '@oclif/core'

export function wait(ms?: number): Promise<void> {
  return ux.wait(ms)
}
