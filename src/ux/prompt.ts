import {ux} from '@oclif/core'

export async function prompt(name: string, options?: ux.IPromptOptions): Promise<string> {
  return ux.prompt(name, options)
}
