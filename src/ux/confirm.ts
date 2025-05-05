import { ux } from '@oclif/core'

export async function confirm(message: string): Promise<boolean> {
  return ux.confirm(message)
} 
