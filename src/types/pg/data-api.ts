import * as Heroku from '@heroku-cli/schema'

export type AddOnWithRelatedData = {
  attachment_names?: string[],
  links?: Link[],
  plan: Required<Heroku.AddOn['plan']>
} & Required<Heroku.AddOnAttachment['addon']>

export type AddOnAttachmentWithConfigVarsAndPlan = {
  addon: AddOnWithRelatedData
  config_vars: Heroku.AddOn['config_vars']
} & Required<Heroku.AddOnAttachment>

export type Link = {
  attachment_name?: string,
  created_at: string,
  message: string,
  name: string,
  remote?: Link,
}
