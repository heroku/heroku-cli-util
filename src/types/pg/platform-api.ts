import * as Heroku from '@heroku-cli/schema'

// This can be removed if at any point we get to generate a correct TypeScript schema from the Platform API
// HyperSchema, but that's not easy due to API variants and some other header-selectable serialization expansion
// options like `Accept-Inclusion` and `Accept-Expansion`.
type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

/**
 * This is the base type for the property `addon` on an `AddOnAttachment` as described in the Platform API Reference.
 */
type AddonDescriptor = DeepRequired<Heroku.AddOnAttachment>['addon']

/**
 * This is the modified type for the `addon` property when the request to Platform API includes the value `addon:plan`
 * in the `Accept-Inclusion` header.
 */
type AddonDescriptorWithPlanInclusion = {
  plan: {
    id: string,
    name: string,
  }
} & AddonDescriptor

/**
 * This is the modified type for the `AddOnAttachment` type when the request to Platform API includes the value
 * `config_vars` in the `Accept-Inclusion` header.
 */
type AddonAttachmentWithConfigVarsInclusion = {
  config_vars: string[]
} & DeepRequired<Heroku.AddOnAttachment>

/**
 * This is the modified type for the `AddOnAttachment` we use on these lib functions because all requests made to
 * Platform API to get add-on attachments, either through the Add-on Attachment List endpoint or the
 * add-on attachment resolver action endpoint, include the header `Accept-Inclusion: addon:plan,config_vars`.
 */
export type ExtendedAddonAttachment = {
  addon: AddonDescriptorWithPlanInclusion
} & AddonAttachmentWithConfigVarsInclusion

/**
 * This is the modified type for the `AddOn` we use on these lib functions because all requests made to
 * Platform API to get add-ons, either through the Add-on List endpoint or the add-on resolver action endpoint,
 * include the header `Accept-Expansion: addon_service,plan`.
 */
export type ExtendedAddon = {
  addon_service: DeepRequired<Heroku.AddOnService>,
  plan: DeepRequired<Heroku.Plan>,
} & DeepRequired<Heroku.AddOn>

export type AddOnWithRelatedData = {
  attachment_names?: string[],
  links?: Link[],
  plan: DeepRequired<Heroku.AddOn['plan']>
} & AddonDescriptor

export type Link = {
  attachment_name?: string,
  created_at: string,
  message: string,
  name: string,
  remote?: Link,
}
